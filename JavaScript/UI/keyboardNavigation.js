let keyboardNavigation = ( function () {
  let _fileName = "keyboardNavigation",

      $motifList = $('#motif-list');

  let init = function () {
    $('#motif-search').on('keyup', function (event) {

      if ( event.code === 'ArrowDown' ) {
        $(event.target).blur();
        let $firstMotifContainer = $( $('.motif-container')[0] );
        $firstMotifContainer.focus().hover();
      }

    });

    $motifList.on('mouseover', function (event) {

      if ( $(event.target).parents().hasClass('motif-container') ) {
        let $hoveredMotifContainer = $(event.target).parents('.motif-container');
        motifContainerKeyHandler($hoveredMotifContainer);
        $hoveredMotifContainer.focus();
      } else if ( $(event.target).hasClass('motif-container') ) {
        motifContainerKeyHandler( $(event.target) );
        $(event.target).focus();
      }

    });

    addHandlerToMotifList();
  };


  let motifContainerKeyHandler = function ($motifContainer) {
    $motifContainer.on('keyup', function (event) {
      event.preventDefault();

      if ( event.code === 'ArrowDown' ) {
        $(`[tabindex=${ +$motifContainer.attr('tabindex') + 1 }]`).focus();
      }

      else if ( event.code === 'ArrowUp' ) {
        if ($motifContainer.attr('tabindex') !== '0')
          $(`.motif-container[tabindex=${+$motifContainer.attr('tabindex') - 1}]`).focus();
        else
          $('#motif-search').focus();
      }

    });

    $motifContainer.on('keydown', function (event) {
      event.preventDefault();

      if ( event.code === 'Enter' )
        $motifContainer.click();
    });

  };


  let addHandlerToMotifList = function () {
    let addFocusinHandler = function () {
      $motifList.one('focusin', function (event) {
        motifContainerKeyHandler( $(event.target) );
      });
    };

      $motifList.one('focusout', function () {
        addHandlerToMotifList();
      });

    addFocusinHandler();
  };


  return {
    init
  }
}());