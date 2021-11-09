let helpButton = ( function () {
  let $helpButton = $('#help-button'),

      _filename = 'helpButton';


  let init = function () {
    $helpButton.addClass('interface-button').on('click', function () {
      window.open('help', '_blank');
    });
  };


  return { init };
}());