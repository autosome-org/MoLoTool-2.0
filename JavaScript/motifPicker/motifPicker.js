var motifPicker = (function () {
    var _fileName = "motifPicker",
        _motifSummaries = [],
        _chosenMotifsSet = new Set(), //ToDo Change Set To Dictionary o(1)

        _defaultMaxResultCount,
        _maxResultCount,

        _motifSummariesSource = function () {};


    var create = function (motifSummariesSource, objectsToDisable) {
        inputStateSwitcher.create(objectsToDisable);

        _defaultMaxResultCount = 5;
        _maxResultCount = _defaultMaxResultCount;

        _motifSummariesSource = motifSummariesSource;

        promiseMotifSummaries().then(promisedMotifSummaries => {
            setMotifSummaries(promisedMotifSummaries);
            inputStateSwitcher.enableInput();

            motifSearch.create();
            motifSearch.applySearch();
        });
    };


    var updateMotifSummaries = function () {
        inputStateSwitcher.disableInput();

        promiseMotifSummaries().then(function (promisedMotifSummaries) {
            _motifSummaries = "";
            setMotifSummaries(promisedMotifSummaries);
            inputStateSwitcher.enableInput();
            motifSearch.applySearch();
        });
    };


    var promiseMotifSummaries = function() {
        return new Promise(function(resolve) {
            var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
            var xhr = new XHR();

            xhr.open('GET', _motifSummariesSource(), true);
            xhr.send();

            xhr.onload = function() {
                resolve( JSON.parse(this.responseText) );
            }

            xhr.onerror = function() {
                errorHandler.logError({"fileName": _fileName, "message": "library is not loaded"});
            }

        });
    }


    var setMotifSummaries = function (promisedMotifSummaries) {
        if (_motifSummaries.length !== 0) {
            errorHandler.logError({"fileName": _fileName, "message": "warning, library is not empty"});
        }
        _motifSummaries = promisedMotifSummaries;
    };


    var setSuggestedMotifList = function (suggestedMotifs) {
        var legendContainer = wrapLegendContainer();
        $('#legend-container').html(legendContainer);

        var topMotifs = suggestedMotifs.slice(0, _maxResultCount),
            motifContainers = $.map(topMotifs, wrapMotifInContainer).join(''),
            chosenMotifs = $('.chosen-in-search');

        $('#motif-list').html(motifContainers);
        if ( $.isEmptyObject(topMotifs) && chosenMotifs.length === 0 ) {
            $(".suggestions").hide();
        } else if ( $.isEmptyObject(topMotifs) ) {
            $("#legend-container").hide();
        } else {
            $("#legend-container").show();
            $(".suggestions").show();
        } // ToDo optional

        /* var ifMoreValue = ifMore(suggestedMotifs);
        if (suggestedMotifs.length > _defaultMaxResultCount) {
            var ifMoreString = wrapIfMoreValueInContainer(ifMoreValue, suggestedMotifs.length);
            var ifMoreContainer = $('#ifMore-container');
            ifMoreContainer.find("#show-more-button span").html(ifMoreString);
            ifMoreContainer.removeClass("hidden");
        } else {
            $('#ifMore-container').addClass("hidden");
        } */
    };


    var ifMore = function (suggestedMotifs) {
        return (suggestedMotifs.length > _maxResultCount) ? (suggestedMotifs.length - _maxResultCount) : 0;
    };


    var wrapLegendContainer = function () {
        return '<div class="motif-title legend">Motif ID</div>' +
        '<div class="motif-family legend">Family</div>' +
        '<div class="motif-gene legend">Gene Name</div>';
    };


    var wrapMotifInContainer = function (suggestedMotif) {
        var summary = suggestedMotif[0],
            primaryInfo = wrapSummaryPrimaryInformation(summary);

        return '<div class="motif-container hover-behavior">' +
            primaryInfo +
            '</div>';
    };


    var wrapSummaryPrimaryInformation = function (motifSummary) {
        var name = motifSummary["full_name"],
            family = motifSummary["motif_families"],
            geneName = motifSummary["gene_names"];

        return '<div class="suggestion"' + ' id="' + name + '">' +
            '<div class="motif-title feature">'+ name +'</div>' +
            '<div class="motif-family feature"><p>'+ family +'</p></div>' +
            '<div class="motif-gene feature">'+ geneName +'</div>' +
            '</div>';
    };


    var wrapIfMoreValueInContainer = function (ifMoreValue, length) {
        var itemsShown = (length >= _maxResultCount) ? _maxResultCount : length;
        return (length) + ' models found. ' + itemsShown + " shown.";
    };


    var ifMotifIsChosen = function (motifName) {
        return _chosenMotifsSet.has(motifName);
    };


    var getRequestedMotifNames = function () {
        var $motifTitles = $(".chosen-motif > .motif-title"),
            requestedMotifNames = [];

        if ($motifTitles.length > 0) {
            $motifTitles.each(function () {
                requestedMotifNames.push($(this).text());
            });
        }

        return requestedMotifNames;
    };
    
    
    var getChosenMotifContainer = function (motifName) {
        var $motifContainer = $(`[data-name='${motifName}'].chosen-in-control`);

        /* if ($motifContainer.hasClass(".chosen-in-control")) {
            return $motifContainer;
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "motif not chosen"});
            return 0;
        } */
        return $motifContainer;
    };


    //wrap string in order to make id select
    var jq = function(myId) {
        return "#" + myId.replace( /([:.\[\],=@])/g, "\\$1" );
    };


    var addChosenMotifToSet = function (motifName) {
        _chosenMotifsSet.add(motifName);
    };


    var deleteChosenMotifFromSet = function (motifName) {
        _chosenMotifsSet.delete(motifName);
    };


    var getMotifSummaries = function () {
        return _motifSummaries;
    };


    var getChosenMotifSet = function () {
        return _chosenMotifsSet;
    };


    var RegExpEscape = function (value) {
        return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    };


    var testedAgainstSearch = function (motifName) {
        var val = $.trim($("#motif-search").val()),
            reg = new RegExp( RegExpEscape(val), 'i');
        return reg.test(motifName);
    };


    var getDefaultMaxResultCount = function () {
        return _defaultMaxResultCount;
    };


    var setMaxResultCount = function (newMaxResultCount) {
        _maxResultCount = parseInt(newMaxResultCount);
    };


    var getMaxResultCount = function () {
        return _maxResultCount;
    };


    return {
        create,

        addChosenMotifToSet,
        deleteChosenMotifFromSet,
        ifMotifIsChosen,

        getMotifSummaries,
        getRequestedMotifNames,
        getChosenMotifContainer,
        getChosenMotifSet,

        setSuggestedMotifList,

        getDefaultMaxResultCount,
        getMaxResultCount,
        setMaxResultCount,

        updateMotifSummaries
    };
}());