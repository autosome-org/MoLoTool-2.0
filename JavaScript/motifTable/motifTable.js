/**
 * Created by Sing on 16.11.2016.
 */
//ToDo: add updateTable

var motifTable = (function () {
    var _fileName = "motifTable",
        _dtTable = undefined,
        _tableID = "#motif-table";

    var create = function(motifFeatureTitles, motifFeaturesRequest) {
        features.create(motifFeatureTitles, motifFeaturesRequest);

        _dtTable = $(_tableID).DataTable(createTable());
        buildUIComponent();

        $('.dt-button').addClass('interface-button');

        return _dtTable;
    };


    var createTable = function () {
        var tableObject = function () {
            return {
                bLengthChange: false,
                bInfo: false,
                bPaginate: false,
                scrollX: true,
                scrollY: "15rem",
                scrollCollapse: true,
                dom: 'Blfrtip',
                columns: createColumns(),
                buttons: createButtons()
            };
        };

        var createColumns = function () {
            var  featuresWidth = {
                    "Motif ID": "8%",
                    "Seq name": "8%",

                    "-log10(P-value)": "4%",
                    "P-value": "3%",
                    "Start": "2%",
                    "End": "2%",
                    "Sequence": "8%",

                    "Strand": "1%",
                    "Logo":"4%",
                    "Uniprot ID":"6%",
                    "Family":"6%",
                    "Subfamily":"6%",
                    "Gene name":"3%"
                },

                featuresToShow = $.map(features.getFeatures(false), function (feature) {
                    return {"data": feature, "title": feature, "width": featuresWidth[feature]};
                }),

                featuresToHide = $.map(features.getFeatures(true), function (feature) {
                    return {"data": feature, "title": feature, "visible": false, "width": featuresWidth[feature]};

                });
            return [].concat(featuresToShow, featuresToHide);
        };


        var createButtons = function () {
            return [
                {
                    extend: 'colvis',
                    text: 'Select columns',
                    columns: ':gt(0)',
                    collectionLayout: "fixed three-column"
                },

                {
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: 'th:not(:first-child)'
                    }
                },

                {
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: 'th:not(:first-child)'
                    }
                },

                {
                    extend: 'pdfHtml5',
                    orientation: 'landscape',
                    pageSize: 'LEGAL',
                    exportOptions: {
                        columns: 'th:not(:first-child)'
                    }
                },

                {
                    text: 'TSV',
                    extend: 'csvHtml5',
                    fieldSeparator: '\t',
                    extension: '.tsv',
                    exportOptions: {
                        columns: 'th:not(:first-child)'
                    }
                }
            ]
        };

        return tableObject();
    };


    var buildUIComponent = function () {
        $('#motif-table').find('tbody')
            .on('click', function () {
                var tr = $(this).closest('tr'),
                    row =_dtTable.row( tr );

                if ( row.child.isShown() ) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    // Open this row
                    row.child(format(row.data())).show();
                    tr.addClass('shown');
                }
            });
    };


    var getHiddenColumnsTitles = function () {
        return _dtTable
            .columns( function (idx ) {
                return _dtTable.column(idx).visible() === false;
            })
            .dataSrc()
            .toArray();
    };


    var format = function (data) {
        var titles = getHiddenColumnsTitles(),
            htmlBox = '<table style="padding-left:50px;">';

        for (var i = 0; i < titles.length; i++) {
            htmlBox += '<tr>' +
                '<td>' + titles[i] + ':</td>' +
                '<td>' + data?.titles[i] + '</td>' +
                '</tr>';
        }

        htmlBox += '</table>';
        return htmlBox;
    };


    var redrawTableWithUpdates = function(tabsUpdate) {
        clearTable();

        for( var i = 0; i < tabsUpdate.length; i++ ) {
            _dtTable.rows.add(getRows(tabsUpdate[i]));
        }

        _dtTable.draw();

        /*$('.logo-button').on('click', function (event) {
            event.preventDefault();

            let $logo = $(event.target).siblings('img'),
                source = $logo.attr('src'),
                newSource;

            if ( /direct/.test(source) )
                newSource = $logo.attr('src').replace('direct', 'revcomp');
            else
                newSource = $logo.attr('src').replace('revcomp', 'direct');

            $logo.attr('src', newSource);
        });*/
    };


    var getRows = function(tabUpdate) {
        var sites = tabUpdate.sites,
            tabId = tabUpdate.tabId,
            tabFeatures = [];

        /*return $.map(sites, function(site) {
            return features.getFrom(site, tabId);
        });*/

        for ( let i = 0; i < sites.length; i++ ) {
            tabFeatures[i] = features.getFrom(sites[i], tabId, i);
        }

        return tabFeatures;
    };


    var clearTable = function () {
        _dtTable.clear().draw();
    };


    let invertModel = function (element) {
        let $directLogo = $(element).siblings('.direct'),
            $invertedLogo = $(element).siblings('.inverted');

        $directLogo.toggleClass('hidden');
        $invertedLogo.toggleClass('hidden');
    };


    return {
        clearTable: clearTable,
        redrawTableWithUpdates: redrawTableWithUpdates,
        create: create,
        invertModel
    };
}());
