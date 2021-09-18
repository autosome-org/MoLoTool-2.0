let resetChosenMotifs = ( function () {
  let _filename = 'resetChosenMotifs',

      $resetChosenButton = $('.reset-chosen-motifs');

  let init = function () {
    $resetChosenButton.on('click', function () {
      $('.chosen-in-control .close').click();
    });
  };


  return { init };
}());