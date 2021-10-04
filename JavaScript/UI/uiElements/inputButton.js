let inputButton = ( function () {
  let _fileName = 'inputButton',

      $inputTextarea = $('#input_textarea'),
      $outputTextarea = $('#output_textarea'),
      $inputButton = $('#input_button'),
      $inputControl = $('#input_control'),

      isEditMode = true,
      sequences,
      _inputCallBack;


  let init = function (inputCallback) {
    digitGuidance.create(10000); // ToDo remove
    _inputCallBack = inputCallback;

    $inputButton.addClass("ui-button ui-corner-all");
    $inputButton.on('click', function () {
        submitOrEdit();
    });

  };


  function submitOrEdit () {
    switch ( $inputButton.text() ) {
      case 'Submit':
        if ( isNoSequenceErrors() ) {
          $inputControl.hide();
          $outputTextarea.width($inputTextarea.width());
          changeRowsQuantity();
          $outputTextarea.height( $('.tab-result').length * 4 + 'rem' );
          isEditMode = false;
          switchSubmitEdit();
          comparisonMode.applyMode();
        } else sequenceLibrary.clear();
        break;
      case 'Edit':
        $inputControl.show();
        sequenceLibrary.clear();
        renderTabs.clearTabs();
        comparisonMode.updateOutputView();
        isEditMode = true;
        switchSubmitEdit();
        break;
    }
  }


  let isNoSequenceErrors = function () {
    return submitSequence(_inputCallBack);
  };


  let submitSequence = function (inputCallback) {
    return inputCallback( $inputTextarea.val() );
  };


  function switchSubmitEdit () {
    $inputButton.text(function (i, text) {
      return text === 'Submit' ? 'Edit' : 'Submit';
    });

    [$inputTextarea, $outputTextarea].forEach(element => {

      element.prop('hidden', function (i, v) {
        return !v;
      });

    });

  }

  function changeRowsQuantity () {
    let rows = isEditMode ? 7 : (sequences.length * 4 - 1);
    $outputTextarea.attr('rows', rows);
  }

  function isSubmitMode () {
    return !isEditMode;
  }

  return {
    init,
    isSubmitMode
  };
}());
