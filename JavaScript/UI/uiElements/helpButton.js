let helpButton = ( function () {
  let $helpButton = $('#help-button'),

      _filename = 'helpButton';


  let init = function () {
    $helpButton.addClass('ui-button ui-corner-all').on('click', function () {
      window.open('help', '_blank');
    });
  };


  return { init };
}());