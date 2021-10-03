let demoButton = ( function () {
  let _fileName = 'demoButton',

      $demoButton = $('#demo-button'),
      $resetButton = $('.reset-chosen-motifs'),
      $pValueLog = $('#pvalue_log'),
      $collectionSelect = $('#collection-select'),
      $motifSearch = $('#motif-search'),
      $modeSelect = $('#mode-select'),
      $inputTextarea = $('#input_textarea'),
      $motifList = $('#motif-list'),
      $inputButton = $('#input_button'),

      defaultValueFor = {
        pValueLog: 4,
        collection: 'human, core',
        search: 'COE1_HUMAN.H11MO.0.A',
        mode: 'Multiple',
        input: '>human SLAMF1 promoter\n' +
            'CAAAAAAGTGATTTAAAGCCTCATGGGAGATGAGCAATCCTCAA\n' +
            '>mouse SLAMF1 promoter\n' +
            'TGATAAAGTGATTTAAAGCCTGATCATAAATGAGCAATCCTGGA'
      },

      _inputCallback;


  let init = function (inputCallback) {
    _inputCallback = inputCallback;

    $demoButton.addClass('ui-button ui-corner-all');

    $demoButton.on('click', function () {

      showDemo();
    });

  };


  let showDemo = function () {
    if ( inputButton.isSubmitMode() ) {
      $inputButton.click();
    }

    $resetButton.click();

    $pValueLog.val( defaultValueFor.pValueLog ).change();
    $collectionSelect.val( defaultValueFor.collection ).selectmenu('refresh').trigger("selectmenuchange");
    $motifSearch.val( defaultValueFor.search ).change().blur();
    $modeSelect.val( defaultValueFor.mode ).selectmenu('refresh');
    $inputTextarea.val( defaultValueFor.input );

    motifSearch.applySearch();
    $motifList.children('.motif-container').click();

    $motifSearch.val('');
    motifSearch.applySearch();

    if ( comparisonMode.getCurrentMode() === 'Single' ) {
      modeSwitcher.switchMode();
    }

    $inputButton.click();
    /*$pValueLog.focus();*/
  };


  return { init };
}());