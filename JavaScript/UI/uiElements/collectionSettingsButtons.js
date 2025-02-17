let collectionSettingsButtons = (function () {
  let _filename = "collectionSettingsButtons",
      updatedURL;

  let init = function (collectionSwitchCallback) {
    $('.model-collection').html('Collection: H13CORE');

    $("#collection-select").selectmenu({width: 'auto'}).on('selectmenuchange', function() {
      let collection = this.value;
      updatedURL = 'https://hocomoco13.autosome.org/' + collection + '.json?summary=true&full=true';
      $('.model-collection').html('Collection: ' + this.value);
      collectionSwitchCallback(updatedURL);
    });

  }

  let reset = function () {

  };

  return {
    init,
    reset,
  };
}());
