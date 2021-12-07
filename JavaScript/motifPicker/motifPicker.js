var motifPicker = (function () {
    var _fileName = "motifPicker",
        _motifSummaries = [],
        _chosenMotifsSet = new Set(), //ToDo Change Set To Dictionary o(1)

        _motifSummariesSource = function () {};


    var create = function (motifSummariesSource, objectsToDisable) {
        inputStateSwitcher.create(objectsToDisable);

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

        /*var motifContainers = $.map(suggestedMotifs, wrapMotifInContainer).join(''),
            chosenMotifs = $('.chosen-in-search');*/
        var motifContainers = "",
            chosenMotifs = $('.chosen-in-search');

        for ( let i = 0; i < suggestedMotifs.length; i++ )
           motifContainers += wrapMotifInContainer(suggestedMotifs[i], i);

        $('#motif-list').html(motifContainers);
        if ( $.isEmptyObject(suggestedMotifs) && chosenMotifs.length === 0 ) {
            $(".suggestions").hide();
        } else if ( $.isEmptyObject(suggestedMotifs) ) {
            $("#legend-container").hide();
            $("#support-info").addClass("not-found");
        } else {
            $("#support-info").removeClass("not-found")
            $("#legend-container").show();
            $(".suggestions").show();
        } // ToDo optional

        var motifCountString = wrapMotifCountValueInContainer(suggestedMotifs.length);
        $('.motif-count').html(motifCountString);
    };


    var wrapMotifCountValueInContainer = function (length) {
        var correctWord = length.toString().slice(-1) === "1" ? 'model' : 'models';
        return `Found <strong>${length}</strong> ${correctWord}`;
    }


    var wrapLegendContainer = function () {
        let hiddenState = subfamilyButton.isShown() ? '' : 'hidden',
            subfamilyShown = subfamilyButton.isShown() ? 'subfamily-shown' : '';

        return '<div class="motif-title legend ' + subfamilyShown + '">Motif ID</div>' +
        '<div class="motif-family legend">Family</div>' +
        '<div class="motif-subfamily legend ' + hiddenState + '">Subfamily</div>' +
        '<div class="motif-gene legend '+ subfamilyShown +'">Gene Name</div>';
    };


    var wrapMotifInContainer = function (suggestedMotif, index) {
        var summary = suggestedMotif[0],
            primaryInfo = wrapSummaryPrimaryInformation(summary);

        return '<div class="motif-container hover-behavior" tabindex="' + index + '">' +
            primaryInfo +
            '</div>';
    };


    var wrapSummaryPrimaryInformation = function (motifSummary) {
        let name = motifSummary["full_name"],
            family = motifSummary["motif_families"],
            subfamily = motifSummary["motif_subfamilies"],
            geneName = motifSummary["gene_names"],
            hiddenState = subfamilyButton.isShown() ? '' : 'hidden',
            subfamilyShown = subfamilyButton.isShown() ? 'subfamily-shown' : '';

        let ifMotifIsChosen = $(`#chosen-motif-list [data-name="${name}"]`).length !== 0,
            ifChosenClass = ifMotifIsChosen ? ' chosen-in-list' : '';

        return  '<div class="suggestion' + ifChosenClass + '" id="' + name + '">' +
            '<div class="motif-title feature ' + subfamilyShown +'">'+ name +'</div>' +
            '<div class="motif-family feature"><p>'+ family +'</p></div>' +
            '<div class="motif-subfamily feature ' + hiddenState + '"><p>' + subfamily + '</p></div>' +
            '<div class="motif-gene feature ' + subfamilyShown + '">'+ geneName +'</div>' +
            '</div>';
    };


    var ifMotifIsChosen = function (motifName) {
        return _chosenMotifsSet.has(motifName);
    };


    var getRequestedMotifNames = function () {
        var $motifTitles = $(".chosen-in-control > .motif-title"),
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

        updateMotifSummaries
    };
}());