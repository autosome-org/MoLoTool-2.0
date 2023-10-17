let resetButton = ( function () {
  let _fileName = 'resetButton',

      $resetButton = $('#reset-button'),
      $resetChosenMotifsButton = $('.reset-chosen-motifs'),
      $pValueLog = $('#pvalue_log'),
      $collectionSelect = $('#collection-select'),
      $motifSearch = $('#motif-search'),
      $modeSelect = $('#mode-select'),
      $inputTextarea = $('#input_textarea'),
      $motifList = $('#motif-list'),
      $inputButton = $('#input_button'),

      defaultValueFor = {
        pValueLog: 4,
        collection: 'H12CORE',
        search: '',
        mode: 'Multiple',
        input: ''
      },

      _inputCallback;


  let init = function (inputCallback) {
    _inputCallback = inputCallback;

    $resetButton.addClass('interface-button');

    $resetButton.on('click', function () {

      resetAll();
    });

  };


  let resetAll = function () {
    if ( inputButton.isSubmitMode() ) {
      $inputButton.click();
    }

    $resetChosenMotifsButton.click();
    colorPicker.resetColorIndex();

    $pValueLog.val( defaultValueFor.pValueLog ).change();
    $collectionSelect.val( defaultValueFor.collection ).selectmenu('refresh').trigger("selectmenuchange");
    $motifSearch.val( defaultValueFor.search ).change().blur();
    $modeSelect.val( defaultValueFor.mode ).selectmenu('refresh');
    $inputTextarea.val( defaultValueFor.input );

    $(window).one("collectionUpdated", () => {
      motifSearch.applySearch();
      $motifList.children('.motif-container').click();

      $motifSearch.val('');
      motifSearch.applySearch();

      if ( comparisonMode.getCurrentMode() === 'Single' ) {
        modeSwitcher.switchMode();
      }

      $inputButton.click();
    });
  };


  return { init };
}());