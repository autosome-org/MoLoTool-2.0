let modelAssembler = (function () {
  let _filename = "modelAssembler",

      _modelList = [],
      _motifNames = [];

  let create = function () {
    thresholdPValueTable.init(1e-15, 1, 1.1, 3);
  };


  let assembleModels = function () {
    let models = pwmParsing.getModels();
    _modelList = [];
    _motifNames = [];

    for (const key in models) {
      let model = {},
          name = key,
          matrix = models[key],
          table = [];

      if (customPwmInput.getMode())
        matrix = pwmParsing.ppmToPwm(matrix);

      table = thresholdPValueTable.getThresholdPValueTable(matrix);
      model = {full_name: name, pwm: matrix, threshold_pvalue_list: table}

      _modelList.push(model);
      _motifNames.push(name);
    }
  };


  let getModels = function () {
    return _modelList;
  };


  let reset = function () {
    _motifNames = [];
    _modelList = [];
    $('#second-level').find('.custom').remove();
  };


  let getNames = function () {
    return _motifNames;
  };


  let buildCustomMotifListComponents = function () {
    let motifNames = getNames();

    for (let i = 0; i < motifNames.length; i++) {
      let name = motifNames[i];
      let $motifContainer = $(`<div class="chosen-motif chosen-in-control custom" data-name="${name}">
<a href="#" class="link-button md-dark material-icons close">close</a>
<span class="description">Custom</span>
<div class="motif-title"><a class="hocomoco-info" style="color: #3c3c3c" target="_blank">${name}</a></div>
</div>`);

      $motifContainer.find('.close').on('click', function () {
        let motifName = $(this).parent().data('name');
        motifLibrary.deleteCustomMotif(motifName);
      });

      colorPicker.addTo($motifContainer);
      $motifContainer.appendTo('#second-level');
    }

  };


  return {
    create,
    assembleModels,
    getModels,
    buildCustomMotifListComponents,
    reset
  }
}());