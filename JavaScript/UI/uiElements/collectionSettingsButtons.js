let collectionSettingsButtons = (function () {
  let _filename = "collectionSettingsButtons",
      updatedURL;

  let init = function (collectionSwitchCallback) {
    $('.model-collection').html('Collection: core');
    $('.species-collection').html('Species: human');


    $("#collection-select").selectmenu().on('selectmenuchange', function() {
      updatedURL =
          'https://hocomoco11.autosome.ru/' + $('#species-select option:selected').val() +
          '/mono.json?summary=true&full=' + this.value;
      $('.model-collection').html('Collection: ' + ( this.value ? 'full' : 'core' ) );
      collectionSwitchCallback(updatedURL);
    });

    $('#species-select').selectmenu().on('selectmenuchange', function() {
      updatedURL =
          'https://hocomoco11.autosome.ru/' + this.value + '/mono.json?summary=true&full=' +
          $('#collection-select option:selected').val();
      $('.species-collection').html('Species: ' + this.value);
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