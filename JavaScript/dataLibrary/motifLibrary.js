/**
 * Created by HOME on 04.02.2017.
 */
var motifLibrary = (function () {
    var _fileName = "motifLibrary",
        _eventHandler = function() {},
        _displayedFeatures = null,

        _library = {},
        _featuresForTableLibrary = {}, //created to speed up requests when building table

        _logoBaseUrl = "https://hocomoco13.autosome.org";


    var create = function (eventHandler) {
        _displayedFeatures = {
            "direct_logo_url": "Logo",
            "uniprot_id_human": "Uniprot ID",
            "tfclass/family": "Family",
            // "tfclass/subfamily": "Subfamily",
            "gene_name_human": "Human gene",
            "gene_name_mouse": "Mouse gene"

        };

        _library = {};

        setEventHandlerTo(eventHandler);
    };


    var setEventHandlerTo = function (eventHandler) {
        _eventHandler = eventHandler;
    };


    var handleEvent = function () {
        _eventHandler();
    };


    var addUnit = function (motifName) {
        if (inLibrary(motifName)) {
            handleEvent();
            errorHandler.logError({"fileName": _fileName, "message": "motif already in the library"});
        } else {
            _library[motifName] = {status: "promised"};

            promiseMotif(motifName).then( motif => {
                    motif.status = "resolved";

                    _library[motif["full_name"]] = motif;
                    _featuresForTableLibrary[motif["full_name"]] = extractDisplayedFeatures(motif);

                    handleEvent();
                    console.log(motif['full_name'] + " motif added \n\n");
                    console.log(extractDisplayedFeatures(motif));
                });
        }
    };


    var inLibrary = function (motifName) {
        return ("undefined" !== typeof(_library[motifName]));
    };


    var promiseMotif = function(motifName) {
        return new Promise(function (resolve) {
            var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
            var xhr = new XHR();
            var motifSource = "https://hocomoco13.autosome.org/motif/" + motifName + ".json?with_matrices=true&with_thresholds=true";

            xhr.open('GET', motifSource, true);
            xhr.send();

            xhr.onload = function() {
                resolve( JSON.parse(this.responseText) );
            }

            xhr.onerror = function() {
                errorHandler.logError({"fileName": _fileName, "message": "motif data is not loaded"});
            }

        });
    }


    let obtainFeature = function (obj, multikey) {
        let currentObj = obj;
        for (let key of multikey.split('/')) {
            if (currentObj === undefined) {
                return undefined;
            }
            currentObj = currentObj[key];
        }
        return currentObj;
    }

    var extractDisplayedFeatures = function (motif) {
        if (_displayedFeatures === null) {
            errorHandler.logError({"fileName": _fileName, "message": "motifLibrary must be created _displayedFeatures = null"});
            return {};
        } else {
            var valuesToDisplay = {}, displayedFeature,
                logoFullUrl, uniprotFullUrl, geneHumanFullUrl, geneMouseFullUrl;

            for (var jsonFeature in _displayedFeatures) {
                displayedFeature = _displayedFeatures[jsonFeature];
                let motifFeature = obtainFeature(motif, jsonFeature);
                if (displayedFeature === "Logo") {
                    logoFullUrl = _logoBaseUrl + motifFeature;
                    valuesToDisplay[displayedFeature] =
                        '<a class="material-icons md-dark interface-button logo-button" ' +
                        'onclick="motifTable.invertModel(this)" title="Click to invert model">sync</a>' +
                        `<img class="direct" src="${logoFullUrl}"/>` +
                        `<img class="inverted hidden" src="${logoFullUrl.replace('direct', 'revcomp')}"/>`;
                }

                else if (displayedFeature === "Uniprot ID") {
                    uniprotFullUrl = "https://www.uniprot.org/uniprot/" + motifFeature;
                    valuesToDisplay[displayedFeature] = "<a href=\"" + uniprotFullUrl + "\"" +
                        " class=\"hocomoco-info\" target=\"_blank\">" +
                        motifFeature + "</a>";
                }

                else if (displayedFeature === "Human gene") {
                    geneHumanFullUrl =
                        "https://www.genenames.org/cgi-bin/gene_symbol_report?match=" + motifFeature;
                    valuesToDisplay[displayedFeature] = "<a href=\"" + geneHumanFullUrl + "\"" +
                        " class=\"hocomoco-info\" target=\"_blank\">" +
                        motifFeature + "</a>";

                }

                else if (displayedFeature === "Mouse gene") {
                    geneMouseFullUrl =
                    "https://www.informatics.jax.org/quicksearch/summary?queryType=exactPhrase&query=" + motifFeature;

                    valuesToDisplay[displayedFeature] = "<a href=\"" + geneMouseFullUrl + "\"" +
                        " class=\"hocomoco-info\" target=\"_blank\">" +
                        motifFeature + "</a>";
                }

                else {
                    valuesToDisplay[displayedFeature] = motifFeature;
                }
            }
            return valuesToDisplay;
        }
    };


    var getTitlesForDisplayedFeatures = function () {
        if (_displayedFeatures === null) {
            errorHandler.logError({
                "fileName": _fileName,
                "message": "motifLibrary must be created _displayedFeatures = null"
            });
            return [];
        } else {
            return Object
                .keys(_displayedFeatures)
                .map(
                    function(key) {
                        return _displayedFeatures[key];
                    }
                );
        }
    };


    var getUnitByName = function (motifName) {
        if (inLibrary(motifName)) {
            if (_library[motifName].status === "promised") {
                errorHandler.logError({"fileName": _fileName, "message": "Motif status: promised. The result" +
                " will be updated right after promise completion."});
            } else {
                return _library[motifName];
            }
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "motif not in the library"});
        }
    };


    var getMotifFeaturesForTable = function (motifName) {
        return _featuresForTableLibrary[motifName];
    };


    var getUnits = function (motifNameList) {
        return $.map(motifNameList, getUnitByName);
    };


    var getUserRequestedUnits = function (userRequestedNames) {
        return getUnits(userRequestedNames);
    };


    var showLibrary = function () {
        console.log(_library);
    };


    return {
        showLibrary: showLibrary, //used for debug

        create: create,
        addUnit: addUnit,
        getUserRequestedMotifUnits: getUserRequestedUnits,

        getMotifFeaturesForTable: getMotifFeaturesForTable,
        getTitlesForDisplayedFeatures: getTitlesForDisplayedFeatures,
        obtainFeature: obtainFeature,
    };
}());
