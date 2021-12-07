let subfamilyButton = (function () {
  let _fileName = 'subfamilyButton',

      $subfamilyButton = $('#subfamily-button'),
      $chosenMotifList = $('#chosen-motif-list'),
      $suggestions = $('.suggestions');


  let init = function () {
    $subfamilyButton.on('click', function (event) {
      $('.motif-subfamily').toggleClass('hidden');
      let innerText = event.target.innerHTML;
      $(event.target).text(innerText === 'Show subfamily' ? 'Hide subfamily' : 'Show subfamily');
      $chosenMotifList.toggleClass('subfamily-shown');
      $suggestions.toggleClass('subfamily-shown');
      motifSearch.applySearch();
    });
  };


  let isShown = function () {
    return $subfamilyButton.text() === 'Hide subfamily';
  };


  return {
    init,
    isShown,
  }
}());