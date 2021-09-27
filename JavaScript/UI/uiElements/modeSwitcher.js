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
    comparisonMode.updateOutputView(newMode);
    synchronizeMode(newMode);
  };


  let synchronizeMode = function (mode) {
    $('.mode-tab').html(mode);
    $modeSelect.find(`option[value=${mode}]`).prop('selected', 'selected');
    $modeSelectButton.find('.ui-selectmenu-text').html(mode);
  };


  let reset = function () {

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
