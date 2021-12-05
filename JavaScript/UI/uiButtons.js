let uiButtons = (function () {
  let _filename = "uiButtons",

      _eventHandler = function() {};

  let create = function (eventHandler, inputCallback, collectionSwitchCallback) {
    setEventHandlerTo(eventHandler);
    setupButtons(inputCallback, collectionSwitchCallback);
  };


  let setEventHandlerTo = function (eventHandler) {
    _eventHandler = eventHandler;
  };


  let handleEvent = function (event) {
    _eventHandler(event);
  };


  let setupButtons = function (inputCallback, collectionSwitchCallback) {
    moLoToolInfo.init();

    modeSwitcher.init();
    // showTableButton.init();

    inputButton.init(inputCallback);

    // inputMethodButton.init();
    // showInputButton.init();
    zoomButton.init("18px", {"top": 30, "bottom": 10});

    // clearButton.init();
    demoButton.init(inputCallback);
    // tutorialButton.init();
    // helpButton.init();
    // homeButton.init();

    // showMoreButton.init();
    collectionSettingsButtons.init(collectionSwitchCallback);
    resetChosenMotifs.init();
    helpButton.init();

    keyboardNavigation.init();
  };

  let generateContent = function (mode) {
    return "<span class=\"icon icon-medium\">" + mode.title + "</span>" +
        "<i class=\"material-icons md-dark\">" + mode.icon + "</i>\n";
  };

  return {
    create,
    handleEvent,
    generateContent
  };
}());