/**
 * Created by HOME on 13.02.2017.
 */
var chosenMotifHighlight = (function () {
    var _fileName = "chosenMotifHighlight",

        _$hoveredMotifs = $('');


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
            var name = jq(segment.sites[i].motifName).replace(/[#\\]/g, '');
            $motif = $motifList.find(`[data-name="${name}"]`);
            addToHovered($motif);
        }

        highlightHoveredMotifs();
    };


    var mouseOutHandler = function () {
        cleanHoveredMotifs();
    };


    return {
        create: create
    };
}());

/*
var mouseListener = (function () {
    var _moduleName = "mouseListener",
        isDown = false; // Tracks status of a mouse button

    var create = function () {
        $("#logSlider").mousedown(function() {
            isDown = true;      // When mouse goes down, set isDown to true
            console.log(isDown);
        })
            .mouseup(function() {
                isDown = false;    // When mouse goes up, set isDown to false
                console.log(isDown);
            });
    };

    var isPressed = function () {
        return isDown;
    };
    return {
        create: create,
        isPressed: isPressed
    };
}());*/

