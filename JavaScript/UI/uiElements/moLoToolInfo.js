let moLoToolInfo = (function () {
  let _fileName = 'moLoToolInfo',

      $molotool = $('#molotool-container'),
      $suggestions = $('.suggestions');

  let init = function () {
    $molotool.on('mouseenter', function () {
      if ( !$('.molotool-info').hasClass('qtip-focus') ) {

        let showInfo = setTimeout(function () {

          if ($molotool.is(':hover') && !$('.molotool-info').hasClass('qtip-focus')) {
            toggleVisibility();

            $molotool.one('mouseleave', function () {
              toggleVisibility();
            });

          }
        }, 700);

        $molotool.one('mouseleave', () => clearTimeout(showInfo));

      }
    });

  $molotool.qtip({

    content: {
      text: 'Sequence motif location tool v2.0. Search TFBSs in DNA sequence with PWMs from HOCOMOCO v11',
      title: {
        text: 'MoLoTool'
      }
    },

    style: {
      tip: false,
      classes: 'custom-tooltip molotool-info'
    },

    position: {
      my: 'top left',
      at: 'bottom left',
      adjust: {
        y: 5,
        x: -25,
        scroll: true
      }
    },

    show: {
      event: "click",
      delay: 100,
      ready: false
    },

    hide: {
      delay: 100,
      event: "click unfocus"
    }

  });
};

  let toggleVisibility = function () {
    if ( !$suggestions.is(':hidden') ) {
      $molotool.click();
      $suggestions.show();
    } else
      $molotool.click();
  };

  return {
    init
  };
}());