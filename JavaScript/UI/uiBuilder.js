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
    buildChosenMotifListComponent();
    removeChosenMotifListComponent();

    colorPicker.create(handleEvent);
    // chosenMotifHighlight.create();

    let motifFeatureTitles = motifLibrary.getTitlesForDisplayedFeatures(),
        motifFeaturesRequest = motifLibrary.getMotifFeaturesForTable,
        table = motifTable.create(motifFeatureTitles, motifFeaturesRequest);
    // buildExternalTableComponent(table);

    PValueInput.create(handleEvent);
    inputParsing.create();
    fileUploader.create()

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


  let inputCallback = function (inputString, status) {
    inputErrors.clearErrorStatus();

    if ($.isEmptyObject( motifPicker.getRequestedMotifNames() )) {
      inputErrors.addToLog("motifListIsEmpty"); //1
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

    let libraryIds = $.map(sequences, sequenceLibrary.addTab);
    $.map(libraryIds, renderTabs.renderResult);

    inputErrors.showErrors(status);
    handleEvent();

    return inputErrors.checkIfNoImportantErrors();
  };


  let setMotifSummariesSource = function (newUrl) {
    _motifSummariesSource = newUrl;
  };


  let buildChosenMotifListComponent = function () {

    $('#motif-list').on('click', '.motif-container', function () {

      let $motifContainer = $(this).find('.suggestion').clone(),
          motifName = $motifContainer.find('.motif-title').text();

      if ( motifIsChosen(motifName) ) {
        $(`.chosen-in-search[data-name="${motifName}"] .close`).click();
        return 0;
      }

      motifPicker.addChosenMotifToSet(motifName);
      motifLibrary.addUnit(motifName);

      let $closeButton = $('<a href="#" class="close link-button md-dark material-icons">close</a>');

      let geneName = $motifContainer.find('.motif-gene').html(),
          $geneName = $('<span class="description">' + geneName + '</span>');

      let hocomocoRef = 'https://hocomoco11.autosome.ru/motif/' + motifName,
          titleWithRef = `<div class="motif-title"><a class="hocomoco-info link-button" href="${hocomocoRef}" target=_blank>` +
              `${motifName}</a><span>  (${geneName})<span></div>`;

      if (motifPicker.getChosenMotifSet().size !== 0) {
        $('.chosen-motif-bar').removeClass('empty');
        $('#support-info').addClass('not-chosen');
      }

      $motifContainer.addClass('chosen-motif chosen-in-search').removeClass('hover-behavior suggestion');
      $motifContainer.removeAttr('id').attr("data-name", motifName);
      $motifContainer.find('.motif-gene, .motif-family, .motif-title').remove();
      $motifContainer.append($closeButton);
      $motifContainer.append( $(titleWithRef));
      $motifContainer.appendTo('#chosen-motif-list');

      let $motifContainerForControl = $motifContainer.clone();
      $motifContainerForControl.addClass('chosen-in-control').removeClass('chosen-in-search');
      $motifContainerForControl.find('.motif-title span').remove();
      colorPicker.addTo($motifContainerForControl);
      $geneName.insertAfter( $motifContainerForControl.find('.sp-replacer') )
      $motifContainerForControl.appendTo('#second-level');

      motifSearch.applySearch();
      if ( inputButton.isSubmitMode() )
        motifHandler.makeFullUpdate();
    })

  };


  let removeChosenMotifListComponent = function () {

    $('#second-level, #chosen-motif-list').on('click', '.close', function (event) {
      let $motifContainer = $(event.target).parent();
      let motifName = $motifContainer.find('.hocomoco-info').text();

      colorPicker.removeFrom($motifContainer);
      motifPicker.deleteChosenMotifFromSet(motifName);

      // $(event.target).qtip('hide');///hiding tooltip

      $('#second-level, #chosen-motif-list').find('[data-name="' + motifName + '"]').remove();

      if (motifPicker.getChosenMotifSet().size === 0) {
        $('#chosen-motif-list, #chosen-legend-container').addClass('empty');
        $('#support-info').removeClass('not-chosen');
      }

      motifSearch.applySearch();
      handleEvent();
    });

  };


  let motifIsChosen = function (motifName) {
    return $(`#chosen-motif-list [data-name="${motifName}"]`).length !== 0;
  }


  let buildExternalTableComponent = function (table) {
    let $motifTableTBody = $('#motif-table').find('tbody'),
        $result = $('#sequence-window__tab-bar, #output_textarea');

    //highlight sequence
    $motifTableTBody
        .on('mouse' + 'enter', 'td', function () {
          let rowData = table.row(this).data(),
              $resultTab = $result.children('.current-tab'),
              resultTabId = $resultTab.attr('data-tab'),
              $resultSequence = $result.find(`.tab-result-sequence[data-tab=${resultTabId}]`);

          if (rowData !== undefined) {
            let start = rowData['Start Position'], finish = rowData['Finish Position'],
                $segment,
                firstID = start,
                lastID;

            while (start <= finish) {
              $segment = $resultSequence.children('[data-start=' + start + ']');
              $segment.addClass('highlighted');
              if ((finish - start + 1) === $segment.text().length) {
                break
              } else {
                start = $segment.next().attr('data-start')
              }
            }
            lastID = start;

            $('#' + firstID).addClass('first');
            $('#' + lastID).addClass('last');
          }
        });

    $motifTableTBody
        .on('mouse' + 'leave', 'td', function () {
          let rowData = table.row(this).data(),
              $resultTab = $result.children('.current-tab'),
              resultTabId = $resultTab.attr('data-tab'),
              $resultSequence = $result.find(`.tab-result-sequence[data-tab=${resultTabId}]`);

          if (rowData !== undefined) {
            let start = rowData['Start Position'], finish = rowData['Finish Position'],
                $segment,
                firstID = start,
                lastID;

            while (start <= finish) {
              $segment = $resultSequence.children('[data-start=' + start + ']');
              $segment.removeClass('highlighted');
              if ((finish - start + 1) === $segment.text().length) {
                break
              } else {
                start = $segment.next().attr('data-start');
              }
            }
            lastID = start;

            $('#' + firstID).removeClass('first');
            $('#' + lastID).removeClass('last');
          }
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
