let uiBuilder = (function () {
  let _fileName = "uiBuilder",

      _eventHandler,
      _motifSummariesSource =
          "https://hocomoco11.autosome.ru/human/mono.json?summary=true&full=false",
      lastWidth = $(window).width(),
      $searchInput = $(".search-container").find("input");


  let buildUI = function () {
    setEventHandlerTo(motifHandler.handleMotifs);

    motifLibrary.create(handleEvent);

    motifPicker.create(getMotifSummariesSource, getObjectsToDisable());
    chosenMotifListComponentBuilder();
    chosenMotifListComponentRemover();

    colorPicker.create(handleEvent);
    // chosenMotifHighlight.create();

    // Table

    PValueInput.create(handleEvent);
    inputParsing.create();

    let tabIdRange = {"min": 1, "max": 10};
    sequenceLibrary.create(tabIdRange);
    renderTabs.create(
        tabIdRange,
        sequenceLibrary.isRecorded,
        sequenceLibrary.deleteTabContentById,
        handleEvent
    );

    uiButtons.create(handleEvent, inputCallback, collectionSwitchCallback);
  }


  let setEventHandlerTo = function (eventHandler) {
    _eventHandler = eventHandler;
  };

  let handleEvent = function (event) {
    let sitesCount = _eventHandler(event);
    console.log(sitesCount, "sitesCount");
  };


  let getObjectsToDisable = function () {
    return $searchInput;
  };


  let getMotifSummariesSource = function () {
    return _motifSummariesSource;
  }


  let collectionSwitchCallback = function (newUrl) {
    setMotifSummariesSource(newUrl);
    motifPicker.updateMotifSummaries();
  };


  let inputCallback = function (inputString /*, replaceCurrent */, status) {
    inputErrors.clearErrorStatus();

    if ($.isEmptyObject( motifPicker.getRequestedMotifNames() )) {
      inputErrors.addToLog("motifListIsEmpty"); //1
    }

    if (status === "fileIsTooBig") {
      inputErrors.addToLog("fileIsTooBig"); //2
      inputErrors.showErrors();
      return false;
    }

    let sequences = inputParsing.parseInput(inputString);//4
    let inputParsedInto,
        checkValue = inputErrors.checkSequenceCharacterError();

    if (sequences.length === 0) {
      inputErrors.addToLog("sequenceListIsEmpty"); //3
      inputErrors.showErrors();
      return false;
    }

    if ( checkValue !== false ) {
      inputParsedInto = inputParsing.assembleParsedValues(sequences, checkValue.rawSequence);
    } else {
      inputParsedInto = inputParsing.assembleParsedValues(sequences, "");
    }

    $("#input_textarea").val(inputParsedInto);

    /* if (replaceCurrent === true) {
      let scrollPosition = $("html").scrollTop();
      sequenceLibrary.clear();
    } */

    let libraryIds = $.map(sequences, sequenceLibrary.addTab);
    $.map(libraryIds, renderTabs.renderResult);

    /* if (replaceCurrent === true) {
      $("html").scrollTop(scrollPosition);
    } */

    inputErrors.showErrors(status);
    handleEvent();


    /* if (comparisonMode.getCurrentMode() === "Multiple") {
      resultTabs.updateWidth("setToMaximum");
    } */

    return inputErrors.checkIfNoImportantErrors();
  };


  let setMotifSummariesSource = function (newUrl) {
    _motifSummariesSource = newUrl;
  };


  let chosenMotifListComponentBuilder = function () {

    $('#motif-list').on('click', '.motif-container', function () {
      let $motifContainer = $(this).find('.suggestion').clone(),
          motifName = $motifContainer.find('.motif-title').text();

      motifPicker.addChosenMotifToSet(motifName);
      motifLibrary.addUnit(motifName);

      let $closeButton = $('<a href="#" class="close link-button md-dark material-icons">close</a>');

      let hocomocoRef = 'https://hocomoco11.autosome.ru/motif/' + motifName,
          titleWithRef = `<div class="motif-title"><a class="hocomoco-info link-button" href="${hocomocoRef}" target=_blank>` +
              `${motifName}</a></div>`;

      let geneName = $motifContainer.find('.motif-gene').html(),
          family = $motifContainer.find('.motif-family p').html(),
          description = geneName + ' - ' + family,
          $description = $('<div class="description">' + description + '</div>');

      if (motifPicker.getChosenMotifSet().size !== 0) {
        $('.chosen-motif-bar').removeClass('empty');
      }

      $motifContainer.addClass('chosen-motif chosen-in-search').removeClass('hover-behavior suggestion');
      $motifContainer.removeAttr('id').attr("data-name", motifName);
      $motifContainer.find('.motif-gene, .motif-family, .motif-title').remove();
      $motifContainer.append($closeButton);
      $motifContainer.append( $(titleWithRef) ).append($description);
      $motifContainer.appendTo('#chosen-motif-list');

      let $motifContainerForControl = $motifContainer.clone();
      $motifContainerForControl.addClass('chosen-in-control').removeClass('chosen-in-search');
      colorPicker.addTo($motifContainerForControl);
      $motifContainerForControl.appendTo('#chosen-motif-control');

      motifSearch.applySearch();
      if ( inputButton.isSubmitMode() )
        motifHandler.makeFullUpdate();
    })

  };


  let chosenMotifListComponentRemover = function () {

    $('#chosen-motif-control, #chosen-motif-list').on('click', '.close', function (event) {
      let $motifContainer = $(event.target).parent();
      let motifName = $motifContainer.find('.hocomoco-info').text();

      motifPicker.deleteChosenMotifFromSet(motifName);

      // $(event.target).qtip('hide');///hiding tooltip

      $('#chosen-motif-control, #chosen-motif-list').find('[data-name="' + motifName + '"]').remove();

      if (motifPicker.getChosenMotifSet().size === 0) {
        $('#chosen-motif-control, #chosen-motif-list, #chosen-legend-container').addClass('empty');
      }

      motifSearch.applySearch();
      handleEvent();
    });

  };


  $('#motif-search').on('input', () => {
    motifSearch.applySearch();
  });


  let resizeOutputTextarea = function () {

    if( $(window).width() !== lastWidth ) {
      let $outputTextarea = $('#output_textarea');

      $outputTextarea.width( $outputTextarea.width() + $(window).width() - lastWidth );
      $('html').width( $(window).width() );
      lastWidth = $(window).width();
    }

  }

  return {
    buildUI,
    resizeOutputTextarea
  };
}());

uiBuilder.buildUI();
motifHandler.handleMotifs();
$(window).resize( function() {
  uiBuilder.resizeOutputTextarea();
});
["", "webkit", "moz", "ms"].forEach(
    prefix => document.addEventListener(prefix+"fullscreenchange", uiBuilder.resizeOutputTextarea, false)
);
