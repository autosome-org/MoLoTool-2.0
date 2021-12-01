let keyboardNavigation = ( function () {
  let _fileName = "keyboardNavigation",

      $motifList = $('#motif-list'),
      $motifSearch = $('#motif-search'),
      $suggestions = $('.suggestions');


  let init = function () {
    $motifSearch.on('keyup', function (event) {

      if ( event.code === 'ArrowDown' ) {
        $(event.target).blur();
        let $firstMotifContainer = $( $('.motif-container')[0] );
        $firstMotifContainer.focus().hover();
        $motifList.addClass('arrow-navigation');
      } else if ( event.code === 'Escape' )
        $suggestions.hide();
      else if ( event.code === 'Enter' )
        $suggestions.show();
    });

    /*$motifSearch.on('keydown', function (event) {
      if ( event.code === 'Tab' ) {
        event.preventDefault();
        $suggestions.hide();
        $collectionSelectButton.addClass();
      }
    });*/

    $(document).on('mouseover', '#motif-list:not(.arrow-navigation) .suggestion', function (event) {

      if ( $(event.target).parents().hasClass('motif-container') ) {
        let $hoveredMotifContainer = $(event.target).parents('.motif-container');
        motifContainerKeyHandler($hoveredMotifContainer);
        $hoveredMotifContainer.focus();
      } else if ( $(event.target).hasClass('motif-container') ) {
        motifContainerKeyHandler( $(event.target) );
        $(event.target).focus();
      }

    });

    $(document).on('mousemove', '#motif-list.arrow-navigation', function () {
      $(this).removeClass('arrow-navigation');
    });

    addHandlerToMotifList();
  };


  let motifContainerKeyHandler = function ($motifContainer) {
    $motifContainer.on('keyup', function (event) {
      event.preventDefault();

      if ( event.code === 'ArrowDown' ) {
        $(`[tabindex=${ +$motifContainer.attr('tabindex') + 1 }]`).focus().hover();
        $motifList.addClass('arrow-navigation');
      }

      else if ( event.code === 'ArrowUp' ) {
        if ($motifContainer.attr('tabindex') !== '0')
          $(`.motif-container[tabindex=${+$motifContainer.attr('tabindex') - 1}]`).focus().hover();
        else
          $('#motif-search').focus();

        $motifList.addClass('arrow-navigation');
      }

      else if ( event.code === 'Escape' ) {
        $motifSearch.focus();
        $suggestions.hide();
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