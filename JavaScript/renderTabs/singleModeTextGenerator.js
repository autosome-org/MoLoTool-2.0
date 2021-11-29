let singleModeTextGenerator = ( function () {
  let _fileName = 'singleModeTextGenerator';

  let extractLinesToSplit = function () {
    let $sequenceContainer = $('#output_textarea').find('.tab-result-sequence:not(.hidden)'),
        $digits = $sequenceContainer.find('.digits span'),
        lineWidth = $digits.width(),
        $rawSequence = $sequenceContainer.find('.sequence .segment');

    return [$digits, $rawSequence, lineWidth];
  };


  let generateObjectToCopy = function () {
    let linesToSplit = extractLinesToSplit(),
        lineLength = calculateLineLength(linesToSplit[2]),
        digitsLines = splitDigits(linesToSplit[0], lineLength),
        sequenceLines = splitSequence(linesToSplit[1], lineLength),
        $objectToCopy = $('<div class="object-to-copy">');

    for ( let i = 0; i < digitsLines.length; i++ )
      $objectToCopy.append(digitsLines[i], sequenceLines[i]);

    return $objectToCopy[0];
  };


  let splitDigits = function ($digits, lineLength) {
    let digitsLines = [],
        digitsText = $digits.html(),
        fontFamily = $digits.css('font-family'),
        fontSize = $digits.css('font-size'),
        lineNumber = Math.ceil(digitsText.length / lineLength);

    for ( let i = 0; i < lineNumber; i++ )
      digitsLines[i] = $('<span>').html( digitsText.slice( lineLength * i, lineLength * (i+1) ) )
          .css({'font-family': fontFamily, 'font-size': fontSize});

    return digitsLines;
  };


  let splitSequence = function ($rawSequence, lineLength) {
    let sequenceLines = [$('<span>')],
        fontFamily = $rawSequence.css('font-family');

    for ( let i = 0, lineNumber = 0, currentSequenceLength = 0; i < $rawSequence.length; i++ ) {
      let $segment = $($rawSequence[i]),
          segmentText = $segment.html();

      currentSequenceLength += segmentText.length;

      if ( currentSequenceLength > (lineNumber + 1) * lineLength ) {
        let lineBreakPoint =
                segmentText.length - currentSequenceLength + (lineNumber + 1) * lineLength,
            style = $segment.attr('style'),
            $firstSegment = $(`<span class="segment">${segmentText.slice(0,lineBreakPoint)}</span>`),
            $secondSegment = $firstSegment.clone().html(segmentText.slice(lineBreakPoint));

        $firstSegment.attr('style', style).css('font-family', fontFamily);
        $secondSegment.attr('style', style).css('font-family', fontFamily);

        sequenceLines[lineNumber].append( $('<div>').append($firstSegment.clone()).html());
        sequenceLines[lineNumber + 1] = $('<p>')
            .html( $('<div>').append($secondSegment.clone()).html() );
        lineNumber++;
      } else {
        sequenceLines[lineNumber].append( $('<div>').append($segment.clone()
            .css('font-family', fontFamily)).html() );
      }

    }

    return sequenceLines;
  };


  let calculateLineLength = function (lineWidth) {
    let $digits = $('.digits span'),
        fontFamily = $digits.css('font-family'),
        fontSize = $digits.css('font-size'),
        $firstTestBlock = $('<span>').html('a')
            .css({ 'font-family': fontFamily, 'font-size': fontSize })
            .appendTo('body'),
        letterWidth = $firstTestBlock.width();

    $firstTestBlock.remove();

    let lineLength = lineWidth / letterWidth + 1;

    if ( lineLength >= 60.9 )
      lineLength++;

    return Math.trunc(lineLength);
  };


  return {
    generateObjectToCopy
  };
}());