var digitGuidance = ( function () {
    var _fileName = "digitGuidance",
        _digitsString;


    var create = function (maxSequenceLength) {
        _digitsString = generateDigitsString(maxSequenceLength);
    };


    var generateDigitsString = function (maxSequenceLength) {
        var digitsString = "", separator = "-", charsBetween = 10;

        for ( var i = 0, toAdd; i < maxSequenceLength; i += toAdd.length ) {
            toAdd = (digitsString.length % charsBetween === 0) ? i.toString() : separator;
            digitsString += toAdd;
        }

        return digitsString;
    };


    var getDigitsFor = function (length) {
        var correctedLength = length;

        while ( _digitsString[correctedLength] !== "-" ) {
            correctedLength++;
        }

        var digits = _digitsString.substring(0, correctedLength);

        return '<span>' + digits + '</span>';
    };


    return {
        create: create,
        getDigitsFor: getDigitsFor
    };
}());