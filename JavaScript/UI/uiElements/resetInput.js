let resetInput = ( function () {
  let _fileName = 'resetInput',

      $inputResetButton = $("#input_reset"),
      $inputTextarea = $("#input_textarea");


  let init = function () {
    $inputResetButton.addClass('ui-button ui-corner-all');

    $inputResetButton.on('click', function () {

      clearInput();
    });

  };


  let clearInput = function () {
    $inputTextarea.val("");
  };


  return { init };
}());