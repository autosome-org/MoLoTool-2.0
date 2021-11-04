var comparisonMode = (function () {
    var _fileName = "comparisonMode",

        $outputTextarea = $('#output_textarea'),
        _eventHandler = function() {},
        _defaultComparisonMode,
        _comparisonMode;


    var create = function (defaultComparisonMode, eventHandler) {
        setEventHandlerTo(eventHandler);

        setDefaultComparisonModeTo(defaultComparisonMode);
        setCurrentModeTo(getDefaultComparisonMode());
    };


    var setEventHandlerTo = function (eventHandler) {
        _eventHandler = eventHandler;
    };


    var handleEvent = function () {
        _eventHandler();
    };


    var getDefaultComparisonMode = function () {
        return _defaultComparisonMode;
    };


    var setDefaultComparisonModeTo = function (newDefaultComparisonMode) {
        _defaultComparisonMode = newDefaultComparisonMode;
    };
    

    var getCurrentMode = function () {
        return _comparisonMode;
    };
    
    
    var setCurrentModeTo = function (newComparisonMode) {
        _comparisonMode = newComparisonMode;
    };


    var switchComparisonMode = function () {
        var newMode = "",
            currentMode = getCurrentMode();

        if ( currentMode === "Single") {
            newMode = switchToMultipleMode();
        } else if ( currentMode === "Multiple") {
            newMode = switchToSingleMode();
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "comparisonMode is undefined"});
        }

        handleEvent();

        return newMode;
    };


    var applyMode = function () {
        var currentMode = getCurrentMode();

        if ( currentMode === "Single" )
            switchToSingleMode();
        else if ( currentMode === "Multiple" )
            switchToMultipleMode();
        else
            errorHandler.logError({"fileName": _fileName, "message": "comparisonMode is undefined"});

        handleEvent();
    };


    var switchToSingleMode = function () {
        setCurrentModeTo("Single");

        if ( !inputButton.isSubmitMode() )
            return "Single";

        let $tabs = $(".tab-result");
        let $resultSequence = $(".tab-result-sequence");

        $tabs.removeClass("current-tab");
        $tabs.first().addClass("current-tab");

        $tabs.find('.mode-tab').addClass('hidden');
        $tabs.first().find('.mode-tab').removeClass('hidden');

        $resultSequence.removeClass("flattened");
        $resultSequence.addClass("hidden full-screen");
        $resultSequence.first().removeClass("hidden");

        renderTabs.setToCurrent(1);

        turnOffLocks();
        $(".lock").addClass("hidden");
        $('#output_textarea').css('white-space', 'normal')
            .css('overflow-x','hidden');
        // resultTabs.updateWidth("reset");
        comparisonMode.updateOutputView('Single');

        return "Single";
    };


    var switchToMultipleMode = function () {
        setCurrentModeTo("Multiple");

        if ( !inputButton.isSubmitMode() )
            return "Multiple";

        let $sequences = $('.tab-result-sequence');

        $(".tab-result").removeClass("current-tab");

        $('.tab-result').find('.mode-tab').removeClass('hidden');

        $sequences.removeClass("hidden full-screen");
        $sequences.addClass("flattened");

        $(".lock").removeClass("hidden");

        $('#output_textarea').css('white-space', 'pre')
            .css('overflow-x','scroll');

        // resultTabs.updateWidth("setToMaximum");
        comparisonMode.updateOutputView();

        return "Multiple";
    };


    var turnOffLocks = function () {
        var $locks = $(".lock .material-icons");
            $locks.each(function () {
                unlockLine($(this));
            });
    };


    var switchLock = function ($target) {
        var currentState = $target.html();
        if (currentState === "lock") {
            unlockLine($target);
        } else {
            lockLine($target);
        }
    };


    var lockLine = function ($target) {
        var tabId = $target.parents(".tab-result").attr("data-tab"),
            $tabToLock = $(".tab-result-sequence[data-tab="+ tabId + "]"),
            shift = $outputTextarea.scrollLeft()/*,
            seqShift = $("#result-sequences").width(),
            tabShift = parseFloat($("#result-tabs").css("width")),
            width = $("#result-sequences").css("width"); */

        $tabToLock.addClass("locked");
        $tabToLock.children().css('left', - shift);

        $target.html("lock");
    };


    var unlockLine = function ($target) {
        var tabId = $target.parents(".tab-result").attr("data-tab"),
            $tabToUnlock = $(".tab-result-sequence[data-tab="+ tabId + "]");

        $tabToUnlock.removeClass("locked");

        $target.html("lock_open");
    };


    let updateOutputView = function (event) {
        let $inputTextarea = $('#input_textarea'),
            $outputTextarea = $('#output_textarea'),
            $sequences = $outputTextarea.find('.sequence'),
            $digits = $outputTextarea.find('.digits'),
            fontSize = $sequences.css('font-size');

        let shift = parseFloat( fontSize ) * 1.28,
            digitsMarginTop = ( event === 'Single' ) ? - shift: 0;
        $digits.css("margin-top", digitsMarginTop + "px");

        let lineHeightConst = ( event === 'Single' ) ? 4 : 1.2,
            newLineHeight = parseFloat(fontSize) * lineHeightConst + 'px';
        $sequences.css('line-height', newLineHeight);
        $digits.css('line-height', newLineHeight);
        $inputTextarea.css('line-height', 'normal');

        if ( event === 'Single' ) {
            let tabId = $('.current-tab').data('tab'),
                sequenceHeight = $sequences.eq(tabId - 1).height(),
                tabBarHeight = $('#tab-bar').height();

            if ( sequenceHeight > tabBarHeight )
                $outputTextarea.height(sequenceHeight);
            else
                $outputTextarea.height(tabBarHeight);

        } else {
            $outputTextarea.height( $('#tab-bar').height() );
        }

    };


    return {
        create: create,

        getCurrentMode: getCurrentMode,
        getDefaultComparisonMode: getDefaultComparisonMode,
        updateOutputView,
        switchComparisonMode: switchComparisonMode,
        applyMode: applyMode,
        switchLock: switchLock,

        turnOffLocks: turnOffLocks
    };
} ());