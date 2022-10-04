let thresholdPValueTable = (function () {
  let _filename = "thresholdPValueTable",

      _minScore,
      _maxScore,
      _scoreFactor,
      _granularity;

  let init = function(min, max, factor, granularity) {
    _minScore = min;
    _maxScore = max;
    _scoreFactor = factor;
    _granularity = granularity;
  };


  let getThresholdPValueTable = function (matrix) {
    let e = _granularity,
        roundMatrix = getRoundMatrix(matrix, e),
        distribution = getScoreDistribution(roundMatrix),
        thresholdPValueTable = [distribution.pop()];

    for (let i = 0; i < distribution.length; i++) {
      let pair = distribution.pop(),
          score = pair[0],
          probability = pair[1],
          previousPValue = thresholdPValueTable[i][1];

      thresholdPValueTable.push([score, previousPValue + probability]);
    }

    return thresholdPValueTable.reverse();
  };


  let getScoreDistribution = function (matrix) {
    let previousQuantities = {0: 1},
        newQuantities,
        e = _granularity,
        sum = 4 ** matrix.length/*,
        min = _minScore * 10 ** e,
        max = _maxScore * 10 ** e,
        bs = getBestScore(matrix),
        ws = getWorstScore(matrix);*/

    for (let position = 0; position < matrix.length; position++) {
      let scores = Object.keys(previousQuantities);
      newQuantities = {};

      for (let i = 0; i < scores.length; i++) {
        let score = Number(scores[i]),
            previousQuantity = previousQuantities[score];

        for (let letter = 0; letter < 4; letter++) {
          let newScore = score + matrix[position][letter],
              quantity = newQuantities[newScore] ? newQuantities[newScore] : 0;
          //if (min - bs <= newScore && newScore <= max - ws)
          newQuantities[newScore] = quantity + previousQuantity;
        }
      }

      previousQuantities = newQuantities;
    }

    let sortedScores = Object.keys(newQuantities).map(Number)
            .sort(function(a, b){return a-b}),
        scoreDistribution = [];

    for (let i = 0; i < sortedScores.length; i++) {
      let score = sortedScores[i];
      scoreDistribution.push([score / 10 ** e, newQuantities[score] / sum])
    }

    return scoreDistribution;
  };


  let getRoundMatrix = function (matrix, granularity) {
    let roundMatrix = [];

    for (let i = 0; i < matrix.length; i++) {
      roundMatrix.push([]);

      for (let j = 0; j < matrix[i].length; j++) {
        let roundedValue = Math.floor(matrix[i][j] * 10 ** granularity);
        roundMatrix[i].push(roundedValue);
      }
    }

    return roundMatrix;
  };


  let getBestScore = function (matrix) {
    let bestScore = 0;

    for (let k = 0; k < matrix.length; k++)
      bestScore += Math.max.apply(null, matrix[k]);

    return bestScore;
  }


  let getWorstScore = function (matrix) {
    let worstScore = 0;

    for (let k = 0; k < matrix.length; k++)
      worstScore += Math.min.apply(null, matrix[k]);

    return worstScore;
  }


  return {
    init,
    getThresholdPValueTable,
  };
}());