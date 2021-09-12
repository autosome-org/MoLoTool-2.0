let collectionSettingsButtons = (function () {
  let _filename = "collectionSettingsButtons",
      updatedURL;

  let init = function (collectionSwitchCallback) {

    $("#collection-select").selectmenu().on('selectmenuchange', function() {
      updatedURL =
          'https://hocomoco11.autosome.ru/' + $('#species-select option:selected').val() +
          '/mono.json?summary=true&full=' + this.value;
      collectionSwitchCallback(updatedURL);
    });

    $('#species-select').selectmenu().on('selectmenuchange', function() {
      updatedURL =
          'https://hocomoco11.autosome.ru/' + this.value + '/mono.json?summary=true&full=' +
          $('#collection-select option:selected').val();
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