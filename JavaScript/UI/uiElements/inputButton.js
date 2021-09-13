let inputButton = ( function () {
  let $inputTextarea = $('#input_textarea'),
      $outputTextarea = $('#output_textarea'),
      $inputButton = $('#input_button').addClass("ui-button ui-corner-all"),

      isEditMode = true,
      rawInputString,
      sequences,
      _inputCallBack;


  let init = function (inputCallback) {
    digitGuidance.create(10000); // ToDo remove
    _inputCallBack = inputCallback;

    $inputButton.on('click', function () {
        submitOrEdit();
    });

  };


  function submitOrEdit () {
    switch ( $inputButton.text() ) {
      case 'Submit':
        if ( isNoSequenceErrors() ) {
          parseInput();
          $outputTextarea.width($inputTextarea.width());
          changeRowsQuantity();
          renderTabs.tempSetSequences(sequences);
          resultTabsStates.getOpenedIds(); // ToDo temporary
          isEditMode = false;
          switchSubmitEdit();
        } else sequenceLibrary.clear();
        break;
      case 'Edit':
        sequenceLibrary.clear();
        renderTabs.clearTabs();
        isEditMode = true;
        switchSubmitEdit();
        break;
    }
  }


  let isNoSequenceErrors = function () {
    return !!addSequence(_inputCallBack);
  };


  let addSequence = function (inputCallback) {
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

  function parseInput () {
    rawInputString = $inputTextarea.val();
    sequences = inputParsing.parseInput(rawInputString);
    inputParsing.assembleParsedValues(sequences);
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
