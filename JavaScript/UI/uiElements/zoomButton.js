var zoomButton = (function () {
    var $button,
        $target,

        getSettingsFor = {
            "default":   {"title":"Font size: ", "zoomIn": "zoom_in", "zoomOut": "zoom_out"},
            "threshold": ""
        },
        defaultFontSize,
        lineHeightConst = 1.2;

    var getNewFontSize = function (deltaSize) {
        var newFontSize = calculateNewFontSize(deltaSize);
        return cutWithThresholds(newFontSize);
    };

    var calculateNewFontSize = function (deltaSize) {
        return parseFloat($target.css("font-size")) + parseFloat(deltaSize) + "px";
    };

    var cutWithThresholds = function (fontSize) {
        var value = parseFloat(fontSize),
            top = getSettingsFor.threshold.top,
            bottom = getSettingsFor.threshold.bottom;
        if (value > top) {
            value = top;
        } else if (value < bottom) {
            value = bottom;
        }

        return value + "px";
    };

    var getLineHeight = function (fontSize) {
        return parseFloat(fontSize) * lineHeightConst + "px";
    };

    var zoom = function (eventType) {
        var $lockedSequences = $('.locked .sequence');
        var newFontSize = (eventType === "zoom_in") ? getNewFontSize("1px") : getNewFontSize("-1px");
        $lockedSequences.css('padding-top', $('.digits').css("line-height") );
        $target.css({"font-size": newFontSize});
        comparisonMode.updateOutputView( comparisonMode.getCurrentMode() );

        $button
            .find("span")
            .empty()
            .html(getSettingsFor.default.title + newFontSize);
    };

    var init = function (defaultFontSizeToSet, thresholds) {
        $button = $("#sequence-window__heading").find(".zoom-button");
        $target = $("#output_textarea").add( $("#input_textarea") );
        getSettingsFor["threshold"] = thresholds;
        defaultFontSize = cutWithThresholds(defaultFontSizeToSet);

        var content =  '<span class="icon icon-medium">'+ getSettingsFor.default.title + defaultFontSize + '</span>' +
            '<div class="zoom-group"><i class="material-icons md-dark interface-button">' + getSettingsFor.default.zoomIn + '</i>\n' +
            '<i class="material-icons md-dark interface-button">' + getSettingsFor.default.zoomOut + '</i></div>\n';

        $button
            .empty()
            .html(content)
            .on('click', function(event) {
                event.preventDefault();

                var eventType = $(event.target).html();
                if (eventType === "zoom_in" || eventType === "zoom_out") {
                    zoom(eventType);
                }
            });
    };

    var reset = function () {
        $target.css({"font-size": defaultFontSize, "line-height": getLineHeight(defaultFontSize)});

        $button
            .find("span")
            .empty()
            .html(getSettingsFor.default.title + defaultFontSize);
    };

    return {
        init: init,
        reset: reset
    }
}());
