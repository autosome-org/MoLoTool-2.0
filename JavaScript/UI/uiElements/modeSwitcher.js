let modeSwitcher = (function () {
    let /* getSettingsFor = {
            "Single":   {"title": "Mode ", "icon": "vertical_align_center"}, //select_all
            "Multiple":   {"title": "Mode ", "icon": "view_headline"} //format_list_bulleted
        }, */
        defaultMode,
        $modeSelect,
        $modeSelectButton,
        $inputTextarea,
        $outputTextarea;


    let init = function () {
        defaultMode = comparisonMode.getDefaultComparisonMode();
        $modeSelect = $('#mode-select').selectmenu({width: 'auto'});
        $modeSelectButton = $('#mode-select-button');
        $inputTextarea = $('#input_textarea');
        $outputTextarea = $('#output_textarea');

        $modeSelect.on('selectmenuchange', function () {
            switchMode();
        });
    };


    let switchMode = function () {
        let newMode = comparisonMode.switchComparisonMode();
        modeSwitcher.updateOutputView(newMode);
        synchronizeMode(newMode);
    };


    let synchronizeMode = function (mode) {
        $('.mode-tab').html(mode);
        $modeSelect.find(`option[value=${mode}]`).prop('selected', 'selected');
        $modeSelectButton.find('.ui-selectmenu-text').html(mode);
    };


    let updateOutputView = function (event) {
        let $sequences = $outputTextarea.find('.sequence'),
            $digits = $outputTextarea.find('.digits'),
            fontSize = $sequences.css('font-size');

        let shift = parseFloat( fontSize ) * 1.28,
            digitsMarginTop = ( event === 'Single' ) ? - shift: 0;
        $digits.css("margin-top", digitsMarginTop + "px");

        let lineHeightConst = ( event === 'Single' ) ? 4 : 1.2,
            newLineHeight = parseFloat(fontSize) * lineHeightConst + 'px';
        $sequences.css('line-height', newLineHeight);
        $digits.css('line-height', newLineHeight);
        $inputTextarea.css('line-height', 'normal');

        if ( event === 'Single' ) {
            let tabId = $('.current-tab').data('tab'),
                sequenceHeight = $sequences.eq(tabId - 1).height(),
                tabBarHeight = $('#tab-bar').height();

            if ( sequenceHeight > tabBarHeight )
              $outputTextarea.height(sequenceHeight);
            else
                $outputTextarea.height(tabBarHeight);

        } else {
            $outputTextarea.height( $('#tab-bar').height() );
        }

    };


    let reset = function () {

        if (comparisonMode.getCurrentMode() !== defaultMode) {
            switchMode();
        }

    };

    return {
        init,
        switchMode,
        updateOutputView,
        reset
    };
}());
