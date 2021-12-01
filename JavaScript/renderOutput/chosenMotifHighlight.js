/**
 * Created by HOME on 13.02.2017.
 */
let chosenMotifHighlight = (function () {
    let _fileName = "chosenMotifHighlight",

        _$hoveredMotifs = $(''),
        $motifTable = $('#motif-table');


    let create = function () {
        let $outputTextarea = $("#output_textarea");

        $outputTextarea.on('mouseenter', ".segment", mouseInHandler);
        $outputTextarea.on('mouseleave', ".segment", mouseOutHandler);
        $motifTable.on('mouseenter', 'tr', mouseInTableHandler);
        $motifTable.on('mouseleave', 'tr', mouseOutTableHandler);
    };


    //wrap string in order to make id select
    let jq = function(myId) {
        return "#" + myId.replace( /([:.\[\],=@])/g, "\\$1" );
    };


    let addToHovered = function ($motif) {
        _$hoveredMotifs = _$hoveredMotifs.add($motif);
    };


    let highlightHoveredMotifs = function () {
        _$hoveredMotifs.addClass("motif-result-hover");
    };


    let cleanHoveredMotifs = function () {
        _$hoveredMotifs.removeClass("motif-result-hover");
        _$hoveredMotifs = $("");
    };


    let mouseInHandler = function () {
        if ( $(this).css('background-color') === 'rgb(255, 255, 255)' ) {
            $(this).addClass('empty-segment');
            return 0;
        }

        let tabId = $(this).parents(".tab-result-sequence").attr("data-tab"),
            segment = sequenceConstructor.findSegmentWith(this.getAttribute('data-start'), tabId),
            $motifList = $("#second-level"), $motif;

        for (let i = 0; i < segment.sites.length; i++) {
            let name = jq(segment.sites[i].motifName).replace(/[#\\]/g, ''),
                siteId = tabId + '-' + i;
            $motif = $motifList.find(`[data-name="${name}"]`);
            addToHovered($motif);
            highlightTableRow(siteId);
        }

        highlightHoveredMotifs();
    };


    let highlightTableRow = function (siteId) {
        let motifTable = $motifTable.DataTable();

        let indexes = motifTable.rows().eq( 0 ).filter( function (rowIndex) {
            return motifTable.cell(rowIndex, 13).data() === siteId;
        } );

        motifTable.rows( indexes ).nodes().to$().addClass( 'highlighted-row' );
    };


    let cleanHighlightedTableRows = function () {
        $motifTable.find('.highlighted-row').removeClass('highlighted-row');
    };
    
    
    let mouseInTableHandler = function () {
        let siteId = $motifTable.DataTable().row(this).data()?.SiteId;

        if ( !siteId )
            return 0;

        let tabId = siteId.slice(0, siteId.indexOf('-') ),
            $allSegments = $(`.tab-result-sequence[data-tab=${tabId}] .segment`),
            name = $( $motifTable.DataTable().row(this).data()['Motif ID'] ).text(),
            start = $motifTable.DataTable().row(this).data().Start,
            end = $motifTable.DataTable().row(this).data().End,
            $segmentsToHighlight = $allSegments.filter(function () {
                let dataStart = +$(this).attr('data-start');
                return dataStart >= +start && dataStart <= +end
            }),
            $motif = $('#second-level').find(`[data-name="${name}"]`);

        addToHovered($motif);
        highlightHoveredMotifs();

        for ( let i = 0; i < $segmentsToHighlight.length; i++ ) {
            $($segmentsToHighlight[i]).addClass('highlighted');
        }
    };


    let mouseOutHandler = function () {
        cleanHoveredMotifs();
        cleanHighlightedTableRows();
    };


    let mouseOutTableHandler = function () {
        mouseOutHandler();
        $('.segment').removeClass('highlighted');
    };


    return {
        create: create
    };
}());

