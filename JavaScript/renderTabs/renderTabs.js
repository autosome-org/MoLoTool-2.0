let renderTabs = ( function () {
  let _fileName = "renderTabs",

      _libraryIdCheck,
      _libraryIdDelete,

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
        $tab = $('<div class="tab-result">' +
            '<div class="tab__row tab__row--icons">' +
            '<a href="#" class="close link-button material-icons md-dark">close</a>' +
            '<a href="#" class="copy link-button material-icons md-dark" data-tab="'+ tabId + '">content_copy</a>' +
            '<a href="3" class="lock link-button material-icons md-dark">lock_open</a>' +
            '<a href="#" class="mode-tab link-button">' + comparisonMode.getCurrentMode() + '</a>' +
            '</div>' +
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
      } else if ( getCurrentMode() === "Multiple" ) {
        if ($target.hasClass("lock")) {
          comparisonMode.switchLock($target);
        }
      } else if ( getCurrentMode() === "Single" ) {
        let tabId = $(this).attr('data-tab');

        if ( getCurrentTabId()[0] !== tabId ) {
          setToCurrent(tabId);
          handleEvent();
          comparisonMode.updateOutputView('Single');
        }
      }
    });

    $tab.find('.mode-tab').on('click', function () {
      modeSwitcher.switchMode();
      comparisonMode.applyMode();
    });

    return $tab;
  };


  let createResultSequence = function (tabId) {
    return $('<div class="tab-result-sequence" data-tab="' + tabId + '">' +
        '<div class="digits"></div>' +
        '<div class="sequence"></div></div>');
  };


  let clearTabs = function () {
    $('#tab-bar').find('.tab').slice(1).remove();
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
      let $tabBar = $("#tab-bar"),
          $tab = createResultTab(tabId),
          $outputTextarea = $("#output_textarea"),
          $resultSequence = createResultSequence(tabId);


      $tabBar.append($tab);
      $outputTextarea.append($resultSequence);


      if (getCurrentMode() === "Single") {
        // $resultSequence.addClass("hidden full-screen");
        // $resultSequence.removeClass("flattened");

        if ($.isEmptyObject(resultTabsStates.getOpenedIds())) {
          setToCurrent(tabId);
        } else {
          hideButton(tabId);
        }

      } else if (getCurrentMode() === "Multiple") {
        $resultSequence.addClass("flattened");
      }

      if ($.isEmptyObject(resultTabsStates.getOpenedIds())) {
        $("#output_textarea").removeClass("empty");
      }

      resultTabsStates.openId(tabId);
      // updateHeight();
    }
  };


  let getCurrentMode = function() {
    return comparisonMode.getCurrentMode();
  };


  let setToCurrent = function (tabId) {
    let $currentTab = $(".tab-result[data-tab=" + tabId + "]");
    let $tabs = $('.tab-result');
    $tabs.removeClass("current-tab");
    $currentTab.addClass("current-tab");

    $tabs.find('.mode-tab').addClass('hidden');
    $currentTab.find('.mode-tab').removeClass('hidden');

    $(".tab-result-sequence").addClass("hidden");
    $(".tab-result-sequence[data-tab=" + tabId + "]").removeClass("hidden");

    $('#output_textarea').height( $tabs.length * 4 + 'rem' );
  };


  let hideButton = function (tabId) {
    $(".tab-result[data-tab=" + tabId + "]").find('.mode-tab').addClass('hidden');
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

          // title = sequenceLibrary.getItemById(tabId).seqValues.title,

          $resultLine = $(".tab-result-sequence[data-tab=" + tabId + "]"),

          $sequence = $resultLine.find(".sequence"),
          $digits = $resultLine.find(".digits");

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
        setToCurrent(newCurrentTabId);
    }

    if ($.isEmptyObject(resultTabsStates.getOpenedIds())) {
      $("#output_textarea").addClass("empty");
    }

    $('#output_textarea').height( $('.tab-result').length * 4 + 'rem' );
  };


  return {
    create,
    clearTabs,
    getIdsToHandle,
    renderResult,
    updateTab,
    setToCurrent,

    tempSetSequences
  }
}());