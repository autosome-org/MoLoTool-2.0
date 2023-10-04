let collectionSettingsButtons = (function () {
  let _filename = "collectionSettingsButtons",
      updatedURL;

  let init = function (collectionSwitchCallback) {
    $('.model-collection').html('Collection: H12CORE');

    $("#collection-select").selectmenu({width: 'auto'}).on('selectmenuchange', function() {
      let collection = this.value;
      updatedURL = 'https://hocomoco12.autosome.org/' + collection + '.json?summary=true&full=true';
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
