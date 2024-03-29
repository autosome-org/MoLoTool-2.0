/**
 * Created by Sing on 06.11.2016.
 */
var motif = (function () {
    var _fileName = "motif",

        _name              = "",
        _pwmMatrix         = [],
        _pwmMatrixReversed = [],
        _thresholdList     = [],
        _length,
        _nDigits = 3;


    var setMotifValues = function (motif) {
        _name              = motif["full_name"];
        _pwmMatrix         = motif["pwm"];
        _pwmMatrixReversed = reversePwmMatrix(motif["pwm"]);
        _thresholdList     = motif["threshold_pvalue_list"];
        _length = motif["pwm"].length;
    };


    /**
     *Flip motif pvm matrix from [[A, C, G, T], ...] to [T, G, C, A], ...]
     *and the entire motif from [0, 1, 2] to [2, 1, 0] according to inverse direction.
     * @param pwmMatrix     :motif pwm matrix
     * @returns {Array.<*>} :flipped motifPwm
     */
    var reversePwmMatrix = function(pwmMatrix) {
        var reversedPwmMatrix = [];     //inverting direction, then inverting complementarity
        for (var i = pwmMatrix.length - 1; i >= 0; i--) {
            reversedPwmMatrix.push(pwmMatrix[i].slice().reverse());
        }
        return reversedPwmMatrix;
    };


    var getNucleotideIndex = function(nucleotideCharacter) {
        var nucleotideIndex = {
            "A" : 0, 'a': 0,
            "C" : 1, 'c': 1,
            "G" : 2, 'g': 2,
            "T" : 3, 't': 3
        };
        return nucleotideIndex[nucleotideCharacter];
    };


    var findSites = function(sequence, pValueMax) {
        var direct = "+", inverse = "-";
        return [].concat(
            findSitesInStrand(sequence, direct, pValueMax),
            findSitesInStrand(sequence, inverse, pValueMax)
        );
    };


    /**
     * Find and return pValue in pre-calculated list of scores
     * _thresholdList :pre-calculated list of pairs [[scoreValue, pValue], []...]
     * @param score                 :weight sum for position i, if motif starts in position i
     * @returns number            :pValue
     * ToDo: make binary search not linear, test that returned result isn't 0, test return function
     */
    var getPValueFromScoreList = function(score) {
        var n = _thresholdList.length;

        if (n === 0) {
            throw new Error("The array cannot be empty");
        } else if ((n === 1) || (score <= _thresholdList[0][0])) {
            return _thresholdList[0][1];
        } else if (score >= _thresholdList[n - 1][0]) {
            return _thresholdList[n - 1][1];
        }

        var left = 0, right = n - 1, mid;
        while (left < right) {
            mid = Math.floor((left + right) / 2);
            if (score >= _thresholdList[mid][0]) {
                left = mid;
            } else {
                right = mid;
            }
            if (left + 1 === right) {
                break;
            }
        }
        return Math.sqrt(_thresholdList[left][1] * _thresholdList[left + 1][1]);
    };


    //Flip [A, C, G, T] into [T, G, C, A] if condition is true and Return
    var flipSequence = function(sequence, condition) {
        if (condition) {
            var flippedReversedSequence = "",
                nucleotideFlipsInto = {
                    "A" : "T", 'a': "t",
                    "C" : "G", 'c': "g",
                    "G" : "C", 'g': "c",
                    "T" : "A", 't': "a",
                    "N" : "N", 'n': "n"
                };

            for (var i = sequence.length - 1; i >= 0; i--) {
                flippedReversedSequence += nucleotideFlipsInto[sequence[i]];
            }
            return flippedReversedSequence;
        } else {
            return sequence;
        }
    };


    var findSitesInStrand = function(sequence, direction, pValueMax) {
        var scoreList = getScoreList(sequence, direction),
            sitesList = [],
            pValue, scorePosition, motifSequence = " ";

        for (scorePosition = 0; scorePosition < scoreList.length; scorePosition++) {
            pValue = getPValueFromScoreList(scoreList[scorePosition]);
            if (pValue <= pValueMax) {
                motifSequence = sequence.slice(scorePosition,  scorePosition + _pwmMatrix.length);
                sitesList.push({
                    motifName: _name,
                    scorePosition: scorePosition,
                    siteLength: _pwmMatrix.length,
                    strength: round(-Math.log10(pValue), _nDigits),
                    strand: direction,
                    pValue: round(pValue, _nDigits + 2),
                    motifSequence: flipSequence(motifSequence, direction === "-")
                });
            }
        }
        return sitesList;
    };


    var choosePwmMatrix = function (direction) {
        if (direction === "-") {
            return _pwmMatrixReversed;
        } else if (direction === "+") {
            return _pwmMatrix;
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "incorrectDirection"});
        }
    };


    /**
     * Get scores for motif in position of i in sequence, for inverted direction we invert pwm matrix instead
     * @param sequence  :initial sequence
     * @param direction :direction of dna strand
     * @returns {Array} :array of weight sums for position i, if motif starts in position i
     */
    var getScoreList = function(sequence, direction) {
        var pwmMatrix = choosePwmMatrix(direction),
            motifLen = pwmMatrix.length,

            seqLen = sequence.length,

            scoreList = new Array(seqLen - motifLen + 1),

            positionInMotif, positionInSequence, currentPosition, letter;

        //counting sum of weights for position i
        for (positionInSequence = 0; positionInSequence < seqLen - motifLen + 1; positionInSequence++){
            scoreList[positionInSequence] = 0;

            for (positionInMotif = 0; positionInMotif < motifLen; positionInMotif++){
                currentPosition = positionInSequence + positionInMotif;

                letter = sequence[currentPosition];
                if (letter === "N" || letter === "n") {
                    scoreList[positionInSequence] += 0;
                } else {
                    scoreList[positionInSequence] += pwmMatrix[positionInMotif][ getNucleotideIndex(letter) ];
                }
            }
        }
        return scoreList;
    };


    var getLength = function () {
        return (typeof _length === 'undefined') ?  0 : _length;
    };


    let round = (number, decimalPlaces) => {
        let factorOfTen = Math.pow(10, decimalPlaces)
        return Math.round(number * factorOfTen) / factorOfTen
    }

    return {
        setMotifValues: setMotifValues,
        findSites: findSites,
        getLength: getLength
    };
}());