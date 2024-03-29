var inputErrors = (function () {
    var _fileName = "inputErrors",

        _errors,
        _seqRegExp,
        _maxUnexpectedCharToShow,
        $errorReport = $('#error-report');


    var create = function (regExp) {
        initErrors();

        _seqRegExp = regExp;
        _maxUnexpectedCharToShow = 5;
    };


    var initErrors = function () {
        _errors = {

            //Interface Errors
            "motifListIsEmpty" : {
                "status": false,
                "value": false,
                "message": "The TFBS model list is empty. Please pre-select a desired set" +
                " of TFBS models by searching models in the interactive catalogue."
            },


            //inputParsing Errors
            "sequenceListIsEmpty" : {
                "status": false,
                "value": false,
                "message": "The submitted list of sequences is empty."
            },
            "sequenceCharacterError" : {
                "status": false,
                "value": false,
                "message": "Submitted sequences contain invalid characters."
            },
            "sequenceCountExceeded" : {
                "status": false,
                "value": false,
                "message": ["Too many sequences submitted (", "), please input ", " or less."]
            },
            "fileIsTooBig" : {
                "status": false,
                "value": false,
                "message": "The file to upload must be less than 20 kb."
            },


            //All is ok
            "errorsFound" : {
                "status": false,
                "value": false,
                "message": "Everything OK: no errors found."
            },
            "demo" : {
                "status": false,
                "value": false,
                "message": "Demo example is loaded."
            }
        };
    };

    
    var clearErrorStatus = function () {
        for (var error in _errors) {
            if (_errors.hasOwnProperty(error)) {
                _errors[error].status = false;
            }
        }
    };


    var addToLog = function (event) {
        if (event === "sequenceListIsEmpty") {
            _errors["sequenceListIsEmpty"].status = true;
        } else if (event === "motifListIsEmpty") {
            _errors["motifListIsEmpty"].status = true;
        } else if (event.title === "sequenceCharacterError") {
            if (_errors["sequenceCharacterError"].status === false) {
                _errors["sequenceCharacterError"].status = true;
                _errors["sequenceCharacterError"].value = event;
            }
        } else if (event === "sequenceCountExceeded") {
            if (_errors["sequenceCountExceeded"].status === false) {
                _errors["sequenceCountExceeded"].status = true;
                _errors["sequenceCountExceeded"].value = 1;
            } else {
                _errors["sequenceCountExceeded"].value += 1;
            }
        } else if (event === "fileIsTooBig") {
            _errors["fileIsTooBig"].status = true;
        }

        _errors["errorsFound"].status = true;
    };


    var checkErrors = function () {
        var errorSequence = ["fileIsTooBig", "sequenceListIsEmpty", "sequenceCountExceeded",
            "motifListIsEmpty", "sequenceCharacterError"],
            errorString = "";

        for(var i = 0, error; i < errorSequence.length; i++) {
            error = _errors[errorSequence[i]];
            if (error.status === true) {
                errorString += getMessageToShow(errorSequence[i]);
            }
        }
        return errorString;
    };


    var getMessageToShow = function (errorName) {
        if (_errors.hasOwnProperty(errorName)) {
            var error = _errors[errorName];

            if (errorName === "sequenceCountExceeded") {
                console.log((error.value + resultTabsStates.getTabIdRange().max));
                return error.message[0] +
                    (error.value + resultTabsStates.getTabIdRange().max) +
                    error.message[1] + (resultTabsStates.getTabIdRange().max) +
                    error.message[2];
            } else if (errorName === "sequenceCharacterError"){
                return getSequenceCharacterErrorMessage(error.value);
            } else {
                return error.message;
            }

        }   else {
            return "Undefined error";
        }
    };


    var getSequenceCharacterErrorMessage = function (errorValue) {
        return "Invalid characters " + getUnexpectedCharactersToShow(errorValue.characters[0]) +
            " in sequence #" + errorValue.sequenceNo + ".";
    };


    var getUnexpectedCharactersToShow = function (rawUnexpectedCharacters) {
        if (rawUnexpectedCharacters.length > _maxUnexpectedCharToShow) {
            return '"' + rawUnexpectedCharacters.slice(0, _maxUnexpectedCharToShow) + "..." + '"';
        } else {
            return '"' + rawUnexpectedCharacters + '"';
        }
    };


    var checkIfNoImportantErrors = function () {
        return ((_errors["sequenceListIsEmpty"].status ||
            _errors["sequenceCharacterError"].status    ||
            _errors["sequenceCountExceeded"].status   ||
            _errors["fileIsTooBig"].status) === false);
    };


    var checkSequenceCharacterError = function () {
        if (_errors["sequenceCharacterError"].status === true) {
            return _errors["sequenceCharacterError"].value;
        } else {
            return false;
        }
    };


    var showErrors = function (status) {
        console.log(_errors);

        var content, message, isNoErrors;
        if (_errors["errorsFound"].status === false) {

            if(status === "demo") {
                content = _errors["demo"].message;
                message = "";
            } else {
                isNoErrors = true;
            }
        } else if (checkIfNoImportantErrors()){
            content = checkErrors().trim();
            message = "Warning"
        } else {
            content = checkErrors().trim();
            message = "Error"
        }

        if ( !isNoErrors ) {
            $('.error-info .qtip-close').click();
            $errorReport.show().qtip({

                content: {
                    text: content,
                    title: {
                        text: message,
                        button: true,
                    }
                },

                style: {
                    tip: false,
                    classes: 'custom-tooltip error-info'
                },

                position: {
                    my: 'top left',
                    at: 'bottom left',
                    adjust: {
                        y: 5,
                        x: -25,
                        scroll: true
                    }
                },

                show: {
                    event: "click",
                    delay: 100,
                    ready: true,
                },

                hide: {
                    delay: 100,
                    event: "close"
                },

                events: {
                    render: {
                        function() {
                            $('.qtip-close').hide();
                        }
                    }
                }

            });
        }
        else {
            $('.error-info .qtip-close').click();
            $('#error-report').hide();
        }

    };


    return {
        create: create,

        clearErrorStatus: clearErrorStatus,
        addToLog: addToLog,
        showErrors: showErrors,

        checkSequenceCharacterError: checkSequenceCharacterError,
        checkIfNoImportantErrors: checkIfNoImportantErrors
    }
}());
