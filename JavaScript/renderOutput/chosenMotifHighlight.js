/**
 * Created by HOME on 13.02.2017.
 */
var chosenMotifHighlight = (function () {
    var _fileName = "chosenMotifHighlight",

        _$hoveredMotifs = $(''),
        $motifTable = $('#motif-table');


    var create = function () {
        var $outputTextarea = $("#output_textarea");

        $outputTextarea.on('mouseenter', ".segment", mouseInHandler);
        $outputTextarea.on('mouseleave', ".segment", mouseOutHandler);
    };


    //wrap string in order to make id select
    var jq = function(myId) {
        return "#" + myId.replace( /([:.\[\],=@])/g, "\\$1" );
    };


    var addToHovered = function ($motif) {
        _$hoveredMotifs = _$hoveredMotifs.add($motif);
    };


    var highlightHoveredMotifs = function () {
        _$hoveredMotifs.addClass("motif-result-hover");
    };


    var cleanHoveredMotifs = function () {
        _$hoveredMotifs.removeClass("motif-result-hover");
        _$hoveredMotifs = $("");
    };


    var mouseInHandler = function () {
        var tabId = $(this).parents(".tab-result-sequence").attr("data-tab"),
            segment = sequenceConstructor.findSegmentWith(this.getAttribute('data-start'), tabId),
            $motifList = $("#second-level"), $motif;

        for (var i = 0; i < segment.sites.length; i++) {
            var name = jq(segment.sites[i].motifName).replace(/[#\\]/g, ''),
                siteId = tabId + '-' + i;
            $motif = $motifList.find(`[data-name="${name}"]`);
            addToHovered($motif);
            highlightTableRow(siteId);
        }

        highlightHoveredMotifs();
    };


    var highlightTableRow = function (siteId) {
        let motifTable = $motifTable.DataTable();

        let indexes = motifTable.rows().eq( 0 ).filter( function (rowIndex) {
            return motifTable.cell(rowIndex, 13).data() === siteId;
        } );

        motifTable.rows( indexes ).nodes().to$().addClass( 'highlighted-row' );
    };


    var cleanHighlightedTableRows = function () {
        $motifTable.find('.highlighted-row').removeClass('highlighted-row');
    };


    var mouseOutHandler = function () {
        cleanHoveredMotifs();
        cleanHighlightedTableRows();
    };


    return {
        create: create
    };
}());

