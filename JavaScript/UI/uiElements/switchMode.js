var switchMode = (function () {
    var /* getSettingsFor = {
            "Single":   {"title": "Mode ", "icon": "vertical_align_center"}, //select_all
            "Multiple":   {"title": "Mode ", "icon": "view_headline"} //format_list_bulleted
        }, */
        defaultMode,
        $modeSelect,
        $modeSelectButton
    ;


    var init = function () {
        defaultMode = comparisonMode.getDefaultComparisonMode();
        $modeSelect = $('#mode-select').selectmenu();
        $modeSelectButton = $('#mode-select-button');

        $modeSelect.on('selectmenuchange', function () {
            switchMode();
        });
    };


    var switchMode = function () {
        var newMode = comparisonMode.switchComparisonMode();
        synchronizeMode(newMode);
    };

    var synchronizeMode = function (mode) {
        $('.mode-tab').html(mode);
        $modeSelect.find(`option[value=${mode}]`).prop('selected', 'selected');
        $modeSelectButton.find('.ui-selectmenu-text').html(mode);
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
