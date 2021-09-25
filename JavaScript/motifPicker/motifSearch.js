var motifSearch = (function () {
    var _fileName = "motifSearch",
        _keysToTest;


    var create = function() {
        _keysToTest = ["full_name", "motif_families", "gene_names"];

        var $search = $('#motif-search');
        var $suggestions = $('.suggestions');
        var $searchContainer = $('.search-container');

        $search.val("");

        $search.on('input', applySearch);

        $searchContainer.on('focusout', function () {
            if ( !$searchContainer.is(':hover') ) {
                $suggestions.hide();
            }
        });

        $('body').on('click', function(e) {
            if ( !$(e.target).is('.search-container, .motif-container, .chosen-in-search') &&
                $(e.target).parents('.search-container, .motif-container, .chosen-in-search').length === 0 ) {
                $suggestions.hide();
            }
        });

        $search.on("focus", function () {
            if ( $suggestions.find('#motif-list').html() )
                $suggestions.show();
        });

        $search.on("click", function () {
            if ( $suggestions.find('#motif-list').html() )
                $suggestions.show();
        });
    };


    var applySearch = function () {
        //ToDo binary search
        $('#motif-search').focus();

        var motifSummaries = motifPicker.getMotifSummaries(), //probably must be in picker
            regExpsToCheck = getRegExpsToCheck(),
            motifsToSuggest = getMotifsToSuggest(motifSummaries, regExpsToCheck);

        motifPicker.setSuggestedMotifList(motifsToSuggest);
    };


    var getMotifsToSuggest = function (motifSummaries, regExpsToCheck) {
        var suggestedMotifs = [];
        if (regExpsToCheck.length > 0) {
            var i, testResult = 0, currentSummary;

            for (i = 0; i < motifSummaries.length; i++) {
                currentSummary = motifSummaries[i];
                testResult = testMotif(currentSummary, regExpsToCheck);

                if (testResult !== 0) {
                    suggestedMotifs.push([currentSummary, testResult]);
                }
            }
        }

        return suggestedMotifs;
    };


    var getRegExpsToCheck = function () {
        var searchInput = getSearchInput(),
            tokens = splitInputIntoTokens(searchInput);
        return $.map(tokens, tokenToRegExp);
    };


    var getSearchInput = function () {
        return $("#motif-search").val();
    };


    var splitInputIntoTokens = function (searchString) {
        var trimmedString = $.trim(searchString),
            tokens = trimmedString.split(" ");
        return tokens.filter(function(s){ return s !== "" });
    };


    var tokenToRegExp = function (token) {
        return new RegExp(RegExpEscape(token), 'i');
    };


    var RegExpEscape = function( value ) {
        return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    };


    var testMotif = function (motifSummary, regExpsToTest) {
        var motifName = motifSummary["full_name"];

        /* if (motifPicker.ifMotifIsChosen(motifName)) {
            return 0;
        } else { */
            var testResult = 0, keysToTest = _keysToTest;
            for(var i = 0, key; i < keysToTest.length; i++) {
                key = keysToTest[i];
                testResult += testKeysWithRegExps(motifSummary[key], regExpsToTest);
            }
            return testResult;
        /* } */
    };


    var testKeysWithRegExps = function (key, regExpsToTest) {
        var testString = keyToString(key);

        for ( var i = 0; i < regExpsToTest.length; i++) {
            if (!regExpsToTest[i].test(testString)) {
                return 0;
            }
        }
        return 1;
    };


    var keyToString = function (key) {
        var stringToTest = "";

        if (typeof key === 'undefined') {
            errorHandler.logError({"fileName": _fileName, "message": "motif summary key is undefined"});
        } else if (typeof key === "string") {
            stringToTest = key;
        } else {
            stringToTest = key.join(" "); //key is array and we join elements with " " separator
        }
        return stringToTest;
    };


    return {
        create: create,
        applySearch: applySearch
    };
}());