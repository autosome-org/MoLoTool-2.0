var switchMode = (function () {
    var getSettingsFor = {
            "Single":   {"title": "Mode ", "icon": "vertical_align_center"}, //select_all
            "Multiple":   {"title": "Mode ", "icon": "view_headline"} //format_list_bulleted
        },
        defaultMode;


    var init = function () {
        defaultMode = comparisonMode.getDefaultComparisonMode();
        $('#mode-select').selectmenu();
    };


    var createButton = function ( $tab ) {
      let $button = $tab.find('.mode-tab');
      switchMode($button);
      switchSingleMultiple($button)
    };


    var switchMode = function ($button) {
        var newMode = comparisonMode.switchComparisonMode();

      $button
          .empty()
          .html(uiButtons.generateContent(getSettingsFor[newMode]));
    };


    var switchSingleMultiple = function ($button) {
      $button.html( comparisonMode.getCurrentMode() )
    };


    var reset = function () {

        if (comparisonMode.getCurrentMode() !== defaultMode) {
            switchMode();
        }

    };

    return {
        init,
        createButton,
        reset
    };
}());
