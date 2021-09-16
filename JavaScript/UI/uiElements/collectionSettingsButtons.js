let collectionSettingsButtons = (function () {
  let _filename = "collectionSettingsButtons",
      updatedURL;

  let init = function (collectionSwitchCallback) {
    $('.model-collection').html('Collection: human, core');

    $("#collection-select").selectmenu({width: 'auto'}).on('selectmenuchange', function() {
      let species = this.value.split(', ')[0];
      let collection = this.value.split(', ')[1];
      updatedURL =
          'https://hocomoco11.autosome.ru/' + species +
          '/mono.json?summary=true&full=' + ( collection === 'full' );
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