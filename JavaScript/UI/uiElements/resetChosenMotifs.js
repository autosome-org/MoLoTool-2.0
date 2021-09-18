let resetChosenMotifs = ( function () {
  let _filename = 'resetChosenMotifs',

      $resetChosenButton = $('.reset-chosen-motifs');

  let init = function () {
    $resetChosenButton.on('click', function () {
      $('.chosen-in-control .close').click();
      $('#motif-search').val('');
      motifSearch.applySearch();
    });
  };


  return { init };
}());