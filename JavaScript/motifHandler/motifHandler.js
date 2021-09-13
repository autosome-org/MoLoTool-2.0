var motifHandler = (function () {
    var _fileName = "motifHandler",

        _requestedPvalue,
        _requestedMotifs;


    var handleMotifs = function (event) {

        if (event === "clearTable" ) {
            motifTable.clearTable();
            return false;
        } else {
            var tabsUpdate = makeFullUpdate();
            return countSitesForUpdate(tabsUpdate);
        }

    };


    var countSitesForUpdate = function (tabsUpdate) {
        var sites = $.map(tabsUpdate, function (tab) {
                return tab.sites.length;
            }),
            sum = 0;

        for(var i = 0; i < sites.length; i++) {
            sum += sites[i];
        }

        return sum;
    };


    var makeFullUpdate = function () {
        setRequestedPvalue();
        setRequestedMotifs();

        var tabsUpdate = updateResultTabs();
        // updateTable(tabsUpdate);

        return tabsUpdate;
    };


    var setRequestedPvalue = function () {
        _requestedPvalue = PValueInput.getPValue();
    };


    var setRequestedMotifs = function () {
        var requestedNames = motifPicker.getRequestedMotifNames();
        _requestedMotifs = motifLibrary.getUserRequestedMotifUnits(requestedNames);
    };


    var updateResultTabs = function () {
        var openedTabsIds = renderTabs.getIdsToHandle(); // replaced

        return $.map(openedTabsIds, updateResultTab);
    };


    var updateResultTab = function(tabId) {
        var sequence = sequenceLibrary.getItemById(tabId).seqValues.sequence,
            sites = getSitesForAllMotifs(sequence);

        renderTabs.updateTab(tabId,
            sequenceConstructor.markupSegmentation(sequence, sites, tabId));

        return {
            "sites": sites,
            "tabId": tabId
        };
    };


    var getSitesForAllMotifs = function (sequence) {
        var sites = [],
            motifs = _requestedMotifs;

        for( var i = 0; i < motifs.length; i++ ) {
            motif.setMotifValues(motifs[i]);

            if ( sequence.length >= motif.getLength() ) {
                sites = sites.concat( motif.findSites(sequence, _requestedPvalue) );
            }

        }

        return sites;
    };


    var updateTable = function (tabsUpdate) {
        if ( getTableState() === "active" ) {
            motifTable.redrawTableWithUpdates(tabsUpdate);
        }
    };


    var getTableState = function () {
        return ($("#motif-table-cmp").hasClass("disabled")) ? "disabled" : "active";
    };

    return {
        handleMotifs: handleMotifs,
        makeFullUpdate
    };
}());