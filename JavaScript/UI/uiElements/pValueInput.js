let PValueInput = (function() {
  let _filename = "_pValueSlider",

      $pValueLinear = $('#pvalue_linear'),
      $pValueLog = $('#pvalue_log'),
      $pValueSlider = $('#pvalue_slider'),
      _isActive = false,
      _eventHandler = function () {};


  let create = function (eventHandler) {
    setEventHandlerTo(eventHandler);
    addSynchronization();
  }


  let setEventHandlerTo = function (eventHandler) {
    _eventHandler = eventHandler;
  };


  let handleEvent = function () {
    _eventHandler();
  };


  let isActive = function () {
    return _isActive;
  };


  let addSynchronization = function () {

    $pValueLinear.on('change', () => {
      let logPValue = -Math.log10($pValueLinear.val()).toExponential(2);
      $pValueLog.val(logPValue);
      $pValueSlider.val(logPValue);
      handleEvent();
    });

    $pValueLog.on('change', () => {
      let logPValue = $pValueLog.val();
      let linearPValue = Math.pow(10, -logPValue).toExponential(2);
      $pValueLinear.val(linearPValue);
      $pValueSlider.val(logPValue);
      handleEvent();
    });

    $pValueSlider.on('input', () => {
      let logPvalue = $pValueSlider.val();
      let linearPValue = Math.pow(10, -logPvalue);
      $pValueLog.val(logPvalue);
      $pValueLinear.val(linearPValue.toExponential(2));
      handleEvent();
    });

  }


  let getPValue = function () {
    return $pValueLinear.val();
  }

  return {
    create,
    isActive,
    getPValue
  };
}());