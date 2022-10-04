/*let thresholdPValueTable = (function () {
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


  let getScoreDistribution = function (matrix) {
    let previousQuantities = {0: 1},
        newQuantities,
        sum = 4 ** matrix.length,
        min = _minScore * 10 **_granularity,
        max = _maxScore * 10 **_granularity,
        bs = getBestScore(matrix),
        ws = getWorstScore(matrix);

    for (let position = 0; position < matrix.length; position++) {
      let scores = Object.keys(previousQuantities);
      newQuantities = {};

      for (let i = 0; i < scores.length; i++) {
        let score = Number(scores[i]),
            previousQuantity = previousQuantities[score];

        for (let letter = 0; letter < 4; letter++) {
          let newScore = score + matrix[position][letter],
              quantity = newQuantities[newScore] ? newQuantities[newScore] : 0;
          if (min - bs <= newScore && newScore <= max - ws)
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
      scoreDistribution.push([score / 10 ** _granularity, newQuantities[score] / sum])
    }

    return scoreDistribution;
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

    return thresholdPValueTable;
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
thresholdPValueTable.init(1e-15, 1, 1.1, 3);
let matrix1 = [[0.5090741546950537,	-0.21028024890713726,	-0.2200790947259461,	-0.323741183564272],
[0.5138122952637563,	-1.000060890477635,	0.08334769261433535,	-0.13516540312174796],
[-0.737136562551106,	0.023428751760788652,	0.4995299870677672,	-0.16267653326259546],
[-1.4211821239147588,	-0.2102802489071374,	-2.2340103118057417,	1.044197061778221],
[-3.903141843818025,	1.367025193191631,	-3.903141843818025,	-3.324736791140142],
[-2.694308015795771,	1.1719568998533512,	-4.400058040447161,	-0.3684145734784018],
[-3.324736791140142,	1.3217083373824634,	-3.903141843818025,	-1.6398057431112052],
[0.0,	                0.9073041393368604,	-1.770121075237143,	-1.0439722185100666],
[0.984016234198772,	-2.694308015795771,	-2.8186351867496584,	0.18027335610535958],
[-2.4841943814369576,	-4.400058040447161,	1.358937047871841,	-4.400058040447161],
[-0.007933171538736454,	-3.903141843818025,	1.0552605395710684,	-2.1628243845506163],
[-3.324736791140142,	-3.572690530904845,	1.367025193191631,	-4.400058040447161],
[0.9601026371179019,	-1.6398057431112054,	0.023428751760788433,	-1.7701210752371432],
[-0.12616068568258346,	0.5463651864892722,	0.015679997751073114,	-0.9788077550035247],
  [-1.4211821239147588,	-0.2102802489071374,	-2.2340103118057417,	1.044197061778221],
  [-3.903141843818025,	1.367025193191631,	-3.903141843818025,	-3.324736791140142],
  [-2.694308015795771,	1.1719568998533512,	-4.400058040447161,	-0.3684145734784018],
  [-3.324736791140142,	1.3217083373824634,	-3.903141843818025,	-1.6398057431112052],
  [0.0,	                0.9073041393368604,	-1.770121075237143,	-1.0439722185100666],
  [0.984016234198772,	-2.694308015795771,	-2.8186351867496584,	0.18027335610535958],
  [-2.4841943814369576,	-4.400058040447161,	1.358937047871841,	-4.400058040447161],
  [-0.007933171538736454,	-3.903141843818025,	1.0552605395710684,	-2.1628243845506163],
  [-3.324736791140142,	-3.572690530904845,	1.367025193191631,	-4.400058040447161],
  [0.9601026371179019,	-1.6398057431112054,	0.023428751760788433,	-1.7701210752371432],
  [-0.12616068568258346,	0.5463651864892722,	0.015679997751073114,	-0.9788077550035247],
[-0.16267653326259557,	0.338606483241983,	-0.9788077550035248,	0.31582044022727834]];

console.time();
console.log(thresholdPValueTable.getThresholdPValueTable(matrix1));
console.timeEnd();*/
console.log(0);