let uiBuilder = (function () {
  let _fileName = "uiBuilder",

      _eventHandler,
      _motifSummariesSource =
          "https://hocomoco11.autosome.ru/human/mono.json?summary=true&full=false",
      $motifSearch = $("#motif-search");


  let buildUI = function () {
    setEventHandlerTo(motifHandler.handleMotifs);

    motifLibrary.create(handleEvent);

    motifPicker.create(getMotifSummariesSource, getObjectsToDisable());
    buildChosenMotifListComponent();
    removeChosenMotifListComponent();

    colorPicker.create(handleEvent);
    chosenMotifHighlight.create();

    let motifFeatureTitles = motifLibrary.getTitlesForDisplayedFeatures(),
        motifFeaturesRequest = motifLibrary.getMotifFeaturesForTable,
        table = motifTable.create(motifFeatureTitles, motifFeaturesRequest);
    buildExternalTableComponent(table);

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
    return $motifSearch;
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
          motifName = $motifContainer.find('.motif-title').text(),
          tabindex = $(this).attr('tabindex');

      if ( motifIsChosen(motifName) ) {
        $(`.chosen-in-search[data-name="${motifName}"] .close`).click();
        $(`.motif-container[tabindex=${tabindex}]`).focus();
        return 0;
      }

      motifPicker.addChosenMotifToSet(motifName);
      motifLibrary.addUnit(motifName);

      let $closeButton = $('<a href="#" class="close link-button md-dark material-icons">close</a>');

      let geneName = $motifContainer.find('.motif-gene').html(),
          $geneName = $('<span class="description">' + geneName + '</span>');

      let hocomocoRef = 'https://hocomoco11.autosome.ru/motif/' + motifName,
          titleWithRef = `<div class="motif-title"><a class="hocomoco-info" href="${hocomocoRef}" target=_blank>` +
              `${motifName}</a><span>  (${geneName})<span></div>`;

      if (motifPicker.getChosenMotifSet().size !== 0) {
        $('.chosen-motif-bar').removeClass('empty');
        $('#support-info').addClass('not-chosen');
      }

      $motifContainer.addClass('chosen-motif chosen-in-search').removeClass('hover-behavior suggestion');
      $motifContainer.removeAttr('id').attr("data-name", motifName);
      $motifContainer.find('.motif-gene, .motif-family, .motif-title, .motif-subfamily').remove();
      $motifContainer.append($closeButton);
      $motifContainer.append( $(titleWithRef));
      $motifContainer.appendTo('#chosen-motif-list');

      let $motifContainerForControl = $motifContainer.clone();
      $motifContainerForControl.addClass('chosen-in-control').removeClass('chosen-in-search');
      $motifContainerForControl.find('.motif-title span').remove();
      colorPicker.addTo($motifContainerForControl);
      $geneName.insertAfter( $motifContainerForControl.find('.sp-replacer') )
      $motifContainerForControl.appendTo('#second-level');

      $motifContainer.find('.close').on('mouseover', function () {
        $(this).addClass('mouseover');
      }).on('mouseleave', function () {
        $(this).removeClass('mouseover');
      }); // Prevents bug when :hover doesn't work

      motifSearch.applySearch();
      if ( inputButton.isSubmitMode() )
        motifHandler.makeFullUpdate();

      $(`.motif-container[tabindex=${tabindex}]`).focus();
      inputErrors.clearErrorStatus();
      inputErrors.showErrors();
    });

  };


  let removeChosenMotifListComponent = function () {

    $('#second-level, #chosen-motif-list').on('click', '.close', function (event) {
      let $motifContainer = $(event.target).parent();
      let motifName = $motifContainer.find('.hocomoco-info').text();

      motifPicker.deleteChosenMotifFromSet(motifName);

      if ( $motifContainer.is(':last-child') )
        colorPicker.removeFrom($motifContainer);

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
        $result = $('#tab-bar, #output_textarea');

    $motifTableTBody
        .on('mouseenter', 'tr', function () {
          let rowData = getRowData(this);

          if ( rowData === 0 )
            return 0

          let $resultTab = $result.children('.current-tab'),
              resultTabId = $resultTab.attr('data-tab'),
              $resultSequence = $result
                  .find(`.tab-result-sequence[data-tab=${resultTabId}] .sequence`);

          let start = rowData['Start'], finish = rowData['End'],
              $segment,
              firstID = start,
              lastID;

          while (+start <= +finish) {
            $segment = $resultSequence.children('.segment[data-start=' + start + ']');
            $segment.addClass('highlighted');
            if ( (finish - start + 1) === $segment.text().length )
              break
            else
              start = $segment.next().attr('data-start')
          }

          lastID = start;

          $('#' + firstID).addClass('first');
          $('#' + lastID).addClass('last');
        });

    $motifTableTBody
        .on('mouseleave', 'tr', function () {
          let rowData = getRowData(this);

          if ( rowData === 0 )
            return 0

          let $resultTab = $result.children('.current-tab'),
              resultTabId = $resultTab.attr('data-tab'),
              $resultSequence = $result
                  .find(`.tab-result-sequence[data-tab=${resultTabId}] .sequence`);

            let start = rowData['Start'], finish = rowData['End'],
                $segment,
                firstID = start,
                lastID;

            while (start <= finish) {
              $segment = $resultSequence.children('[data-start=' + start + ']');
              $segment.removeClass('highlighted');
              if ( (finish - start + 1) === $segment.text().length )
                break
              else
                start = $segment.next().attr('data-start');
            }

            lastID = start;

            $('#' + firstID).removeClass('first');
            $('#' + lastID).removeClass('last');
        });

    let getRowData = function (tableRow) {
      if ( comparisonMode.getCurrentMode() !== 'Single' )
        return 0;

      let rowData = table.row(tableRow).data();

      if ( !rowData )
        return 0;

      return rowData;
    };

  };


  $('#motif-search').on('input', () => {
    motifSearch.applySearch();
  });


  return {
    buildUI
  };
}());

uiBuilder.buildUI();
motifHandler.handleMotifs();
