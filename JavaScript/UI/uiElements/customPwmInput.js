let customPwmInput = (function () {
  let _filename = "customPwmInput",

      $pwmButton = $('#pwm-button'),
      $pwmWindow = $('#pwm-window'),
      $pwmSubmitButton = $('#pwm-submit-button'),
      $pwmInput = $('#pwm-input'),
      $pwmModeSwitcher = $('#pwm-mode-switcher'),
      $pwmWindowBackground= $('#pwm-window-background'),

      _inputCallback;


  let init = function (inputCallback) {
    _inputCallback = inputCallback;

    $pwmButton.addClass('interface-button');
    $pwmModeSwitcher.addClass('interface-button');
    $pwmSubmitButton.addClass('interface-button');


    $pwmButton.on('click', function () {
      $pwmWindow.toggleClass('hidden');
      $pwmWindowBackground.toggleClass('hidden');
      $pwmInput.focus();
    });

    $pwmWindowBackground.on('click', function (event) {
        $pwmWindow.addClass('hidden');
        $pwmWindowBackground.addClass('hidden');
    });

    $pwmWindow.on('focusout', function () {
      if ( !$pwmWindow.is(':hover') && !$pwmWindow.focusin() ) {
        $pwmWindow.addClass('hidden');
      }
    });

    $pwmWindow.on('keyup', function (event) {
      if (event.code === 'Escape') {
        $pwmWindow.addClass('hidden');
      }
    });

    $pwmSubmitButton.on('click', function () {
      modelAssembler.reset();
      let inputString = $pwmInput.val();
      pwmParsing.parseInput(inputString);
      modelAssembler.assembleModels();
      motifHandler.makeFullUpdate();
      $pwmWindow.addClass('hidden');
      $pwmWindowBackground.addClass('hidden');
      modelAssembler.buildCustomMotifListComponents();
    });

    $pwmModeSwitcher.on('click', function () {
      $pwmModeSwitcher.find('div').toggleClass('interface-button selected');

      switchMode();
    });
  }


  let getMode = function () {
    return $pwmModeSwitcher.data('mode');
  };


  let switchMode = function () {
    let mode = $pwmModeSwitcher.data('mode');
    mode = mode === 'pwm' ? 'ppm' : 'pwm';
    $pwmModeSwitcher.data('mode', mode);
    $pwmModeSwitcher.find('.pwm').toggleClass('is-on');
    $pwmModeSwitcher.find('.ppm').toggleClass('is-on');
  };


  return {
    init,
    getMode
  };
}());