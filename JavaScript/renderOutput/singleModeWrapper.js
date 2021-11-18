let singleModeWrapper = ( function () {
  let _fileName = 'singleModeWrapper',

  $outputTextarea = $('#output_textarea'),
  $sequenceContainer,
  _outputTextareaWidth,
  _sequence,
  _sequenceLength,
  _lineLength,
  _digitsLines;


  let create = function () {
    setLineLength();

    $(window).resize( function () {
      if ( inputButton.isSubmitMode() && comparisonMode.getCurrentMode() === 'Single' ) {
        updateSize();
      }
    });
  };


  let makeFullUpdate = function () {
    $sequenceContainer = $('.tab-result-sequence.full-screen');
    setSequence();
    setOutputTextareaWidth();
    setDigitsLines();
    fillOutputTextarea();
  };


  let updateSize = function () {
    setOutputTextareaWidth();
    setDigitsLines();
    fillOutputTextarea();
  };


  let updateColoring = function () {
    $sequenceContainer = $('.tab-result-sequence.full-screen');
    setSequence();
    fillOutputTextarea();
  };


  let fillOutputTextarea = function () {
    let lineNumber = getLineNumber(),
        sequenceLines = splitSequence(),
        outputText = "";

    for ( let i = 0; i++; i < lineNumber )
      outputText += `<p>${_digitsLines[i]}</p><p>${sequenceLines[i]}</p>`;

    alert(_lineLength);
  };


  let setDigitsLines = function () {
    let digits = $sequenceContainer.find('.digits span').html();
    _sequenceLength = digits.length;

    setLineLength();
    let lineNumber = getLineNumber();

    for ( let i = 0; i < lineNumber; i++ )
      _digitsLines[i] = digits.slice( _lineLength * i, _lineLength * (i+1) );
  };


  let splitSequence = function () {
    let sequenceLines = [],
        $segments = _sequence.find('span'),
        currentLength = 0;

    for ( let i = 0, j = 0; j++; j < $segments.length ) {
      let $segment = $segments[j],
          segmentText = $segment.html();
      currentLength += segmentText.length;

      if ( currentLength > i * _lineLength ) {
        let lineBreakPoint = currentLength - i * _lineLength,
            style = $segment.attr('style'),
            $firstSegment = $(`<span class="segment">${segmentText.slice(0,lineBreakPoint)}</span>`),
            $secondSegment = $firstSegment.html(segmentText.slice(lineBreakPoint));

        $firstSegment.attr('style', style);
        $secondSegment.attr('style', style);

        sequenceLines[i] += $('<div>').append($firstSegment.clone()).remove().html();
        sequenceLines[i + 1] = $('<div>').append($secondSegment.clone()).remove().html();
        i++;
      } else {
        sequenceLines[i] += $('<div>').append($segment.clone()).remove().html();
      }

    }

    return sequenceLines;
  };


  let setSequence = function () {
    _sequence = $sequenceContainer.find('.sequence');
  };


  let getLineNumber = function () {
    return Math.floor( _sequenceLength / _lineLength );
  };


  let setLineLength = function () {
    _lineLength = _outputTextareaWidth / countFontConst() - 1;
  };


  let setOutputTextareaWidth = function () {
    _outputTextareaWidth = parseInt($('#output_textarea').width);
  };


  let countFontConst = function () {
    let fontFamily = $outputTextarea.css('font-family'),
        fontSize = $outputTextarea.css('font-size');

    let testTextBlock = $('<p>te</p>').css('font-family', fontFamily)
        .css('font-size', fontSize);

    return parseInt( testTextBlock.width() ) / 2;
  };


  return {
    create,
    makeFullUpdate,
    updateSize,
    updateColoring
  };
}());