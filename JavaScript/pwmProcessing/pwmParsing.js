let pwmParsing = (function () {
  let _filename = "pwmParsing",

      _models = {};


  let parseInput  = function (inputString) {
    let inputArray = inputString.split("\n"),
        customModels = {},
        currentMatrix = [],
        lastHeading = "",
        noHeadingMode = false,
        emptyHeadingCounter = 0,
        currentString = "";

    for (let i = 0; i < inputArray.length; i++) {
      currentString = inputArray[i].trim();
      let matrixRow = toMatrixRow(currentString),
          heading = toHeading(currentString);


      if (matrixRow) {
        if (!lastHeading && Object.keys(customModels).length === 0) {
          noHeadingMode = true;
        }

        currentMatrix.push(matrixRow);
      } else if (heading && !noHeadingMode) {
        if (currentMatrix.length !== 0) {
          customModels[lastHeading] = currentMatrix;
          currentMatrix = [];
        }

        lastHeading = heading;
      } else if (!currentString && noHeadingMode && currentMatrix.length !== 0) {
        lastHeading = `Custom model ${++emptyHeadingCounter}`;
        customModels[lastHeading] = currentMatrix;
        lastHeading = "";
        currentMatrix = [];
      }

    }

    if (toMatrixRow(currentString) || !currentString) {
      if (noHeadingMode)
        lastHeading = `Custom model ${++emptyHeadingCounter}`;
      if (currentMatrix.length !== 0)
        customModels[lastHeading] = currentMatrix;
    }

    if (customPwmInput.getMode() === "ppm")
      for (const key in customModels) {
        customModels[key] = ppmToPwm(customModels[key])
      }

    setModels(customModels);
  };


  let toHeading = function (singleLine) {
    if (regexpIndexOf(singleLine, /[>A-Za-z]/, 0) === -1)
      return false;
    else {
      let heading = singleLine.trim();

      if ( heading.startsWith('>') )
        heading = heading.slice(1);

      return heading;
    }
  };


  let toMatrixRow = function (singleLine) {
    let matrixRow = singleLine.replace(/\t/g, ' ').split(' ');

    if (regexpIndexOf(singleLine, /[^\n\r\t0-9e\-. ]/, 0) !== -1)
      return false;
    if (matrixRow.length === 4)
      return matrixRow.map(Number);

    return false;
  };


  let regexpIndexOf = function(text, re, i) {
    let indexInSuffix = text.slice(i).search(re);
    return indexInSuffix < 0 ? indexInSuffix : indexInSuffix + i;
  };


  let getModels = function () {
    return _models;
  };


  let setModels = function (models) {
    _models = models;
  };


  let ppmToPwm = function (matrix) {
    for (let i = 0; i < matrix.length; i++)
      for (let j = 0; j < matrix.length; j++)
        matrix[i][j] = Math.log(matrix[i][j] / 0.25);
  };


  return {
    parseInput,
    getModels,
    ppmToPwm
  };
}());
