let renderTabs = ( function () {
  let _fileName = "renderTabs",

      _libraryIdCheck,
      _libraryIdDelete,
      $tabTemplate = $('.tab'),

      _sequences,
      _eventHandler = function () {};

  let create = function (tabIdRange, libraryIdCheck, libraryIdDelete, eventHandler) {
    resultTabsStates.create(tabIdRange);
    comparisonMode.create("Multiple", eventHandler);
    digitGuidance.create(10000);
    clipboardCopy.create();

    setLibraryIdCheck(libraryIdCheck);
    setLibraryIdDelete(libraryIdDelete);
    setEventHandlerTo(eventHandler);
  };


  let setLibraryIdCheck = function (libraryIdCheck) {
    _libraryIdCheck = libraryIdCheck;
  };


  let setLibraryIdDelete = function (libraryIdDelete) {
    _libraryIdDelete = libraryIdDelete;
  };


  let setEventHandlerTo = function (eventHandler) {
    _eventHandler = eventHandler;
  };


  let handleEvent = function () {
    _eventHandler();
  };


  let tempSetSequences = function (sequences) {
    _sequences = sequences;
  };


  let createResultTab = function (tabId) {
    let title = sequenceLibrary.getItemById(tabId).seqValues.title,
        $tab = $('<div class="tab tab-result">' +
            '<div class="tab__row tab__row--icons">' +
            '<a href="#" class="close link-button material-icons md-dark">close</a>' +
            '<a href="#" class="copy link-button material-icons md-dark">content_copy</a>' +
            '<a href="3" class="lock link-button material-icons md-dark">lock_open</a>' +
            '<a href="#" class="mode-tab link-button">Multiple</a></div>' +
            '<div class="tab__row tab__row--title">' +
            '<p class="tab__row__sequence-title"></p></div>' +
            '<div class="tab__row tab__row--actions">' +
            '</div></div>').css('display', 'block');

    $tab.attr('id', title.replace(/\s+/g, '') );
    $tab.attr('data-tab', tabId);
    $tab.find('.tab__row__sequence-title').text(title);

    $tab.on("click", function (event) {
      event.preventDefault();
      let $target = $(event.target);

      if ($target.hasClass("close")) {
        // $target.qtip("hide");
        closeTab(this);
        handleEvent();
      }

      switchMode.createButton($tab);
    });

    return $tab;
  };


  let createResultSequence = function (tabId) {
    return $('<div class="tab-result-sequence" data-tab="' + tabId + '">' +
        '<div class="digits"></div>' +
        '<div class="sequence"></div></div>');
  };


  let clearTabs = function () {
    $('#sequence-window__tab-bar').find('.tab').slice(1).remove();
  };


  let getIdsToHandle = function () {

    if (getCurrentMode() === "Single") {
      return getCurrentTabId();
    } else {
      return resultTabsStates.getOpenedIds();
    }

  };

  let renderResult = function (tabId) {
    if ( !_libraryIdCheck(tabId) ) {
      errorHandler.logError({"fileName": _fileName, "message": "tab cannot be added to result, id not in sequenceLibrary"});
      return 0;
    } else if (resultTabsStates.idIsOpened(tabId)) {
      errorHandler.logError({"fileName": _fileName, "message": "tab cannot be added to result, it's already in result"});
      return 0;
    } else {
      let $tabBar = $("#sequence-window__tab-bar"),
          $tab = createResultTab(tabId),

          $outputTextarea = $("#output_textarea"),
          $resultSequence = createResultSequence(tabId);


      $tabBar.append($tab);
      $outputTextarea.append($resultSequence);


      if (getCurrentMode() === "Single") {
        $resultSequence.addClass("hidden full-screen");
        $resultSequence.removeClass("flattened");

        if ($.isEmptyObject(resultTabsStates.getOpenedIds())) {
          // setToCurrent(tabId);
        }
      } else if (getCurrentMode() === "Multiple") {
        $resultSequence.addClass("flattened");
      }

      if ($.isEmptyObject(resultTabsStates.getOpenedIds())) {
        $("#result-cmp").removeClass("empty");
      }

      resultTabsStates.openId(tabId);
      // updateHeight();
    }
  };


  let getCurrentMode = function() {
    return comparisonMode.getCurrentMode();
  };


  let getCurrentTabId = function () {

    if ($.isEmptyObject(resultTabsStates.getOpenedIds())) {
      return [];
    }

    let $currentTab = $('.tab-result.current-tab'),
        currentTabId = $currentTab.attr('data-tab');

    if (($currentTab.length !== 1) || currentTabId === undefined) {
      errorHandler.logError({"fileName": _fileName, "message": "currentTab Id is undefined"});
      return [];
    } else {
      return [currentTabId];
    }

  };


  let updateTab = function (tabId, content) {

    if (resultTabsStates.idIsOpened(tabId)) {
      let digits = digitGuidance.getDigitsFor(getDigitsLength(tabId)),

          title = sequenceLibrary.getItemById(tabId).seqValues.title,

          $resultLine = $(".tab-result-sequence[data-tab=" + tabId + "]"),

          $sequence = $resultLine.find(".sequence"),
          $digits = $resultLine.find(".digits");
      console.log($resultLine)

      $sequence.empty().html(content);
      $digits.empty().html(digits);

      // updateMargin(tabId);
    } else {
      console.log(tabId);
      errorHandler.logError({"fileName": _fileName, "message": "tab cannot be updated it's not opened"});
    }

  };

  let getDigitsLength = function (tabId) {
    let seqLength = sequenceLibrary.getItemById(tabId).seqValues.sequence.length,
        titleLength = sequenceLibrary.getItemById(tabId).seqValues.title.length;

    return Math.max(seqLength, titleLength);
  };


  let closeTab = function (source) {
    let $tab = $(source),
        tabId = $tab.attr('data-tab');

    resultTabsStates.closeId(tabId);

    _libraryIdDelete(tabId);

    $tab.remove();
    $(".tab-result-sequence[data-tab=" + tabId + "]").remove();
    // updateHeight();

    if (getCurrentMode() === "Multiple" ) {
      // updateWidth("reset");
      // updateWidth("setToMaximum");
    } else if (getCurrentMode() === "Single" &&
        !$.isEmptyObject(resultTabsStates.getOpenedIds()) ) {

      let newCurrentTabId = $(".tab-result").first().attr("data-tab");
      // setToCurrent(newCurrentTabId);
    }

    if ($.isEmptyObject(resultTabsStates.getOpenedIds())) {
      $("#result-cmp").addClass("empty");
    }
  };


  return {
    create,
    clearTabs,
    getIdsToHandle,
    renderResult: renderResult,
    updateTab,

    tempSetSequences
  }
}());