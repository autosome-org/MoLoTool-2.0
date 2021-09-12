var switchMode = (function () {
    var getSettingsFor = {
            "Single":   {"title": "Mode ", "icon": "vertical_align_center"}, //select_all
            "Multiple":   {"title": "Mode ", "icon": "view_headline"} //format_list_bulleted
        },
        defaultMode,
        $selectMode;


    var init = function () {
        defaultMode = comparisonMode.getDefaultComparisonMode();
        $selectMode = $('#mode-select').selectmenu();
    };


    var switchMode = function () {
        var newMode = comparisonMode.switchComparisonMode();
        var currentMode = comparisonMode.getCurrentMode();
        $('.mode-tab').html( currentMode );
        $selectMode.find(`option[value=${currentMode}]`).prop('selected', 'selected');
    };

    var reset = function () {

        if (comparisonMode.getCurrentMode() !== defaultMode) {
            switchMode();
        }

    };

    return {
        init,
        switchMode,
        reset
    };
}());
