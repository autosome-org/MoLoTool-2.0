/**
 * Created by HOME on 01.02.2017.
 */
var colorPicker = (function () {
    var _fileName = "colorPicker",
        _defaultColors =    [
          "#F15854",
          "#FAA43A",
          '#DECF3F',
          "#60BD68",//4

          "#5DA5DA",
          "#F17CB0",
          "#B276B2",
          "#B2912F",//4


          "#ff0000",
          "#FF9800",
          "#4CAF50",
          "#2196F3",
          "#9C27B0",//5

          "#E91E63",
          "#f75c03",
          "#5c8001",
          "#3F51B5",
          "#4e0250",//5

          "#b02e0c",
          "#FFC107",
          "#134611",
          "#0a2463",
          "#9c3848",//5

          "#ef7674",
          "#795548",
          "#0d160b",
          "#607D8B",
          "#c490d1"//5

        ],

        _freeColorIndex = 0,
        _eventHandler = function () {
            errorHandler.logError({"fileName": _fileName, "message": "_eventHandler hasn't been set"});
        };


    var create = function (eventHandler) {
        setEventHandlerTo(eventHandler);
    };

    var setEventHandlerTo = function (eventHandler) {
        _eventHandler = eventHandler;
    };


    var lastFreeColor = function () {
        return _defaultColors[_freeColorIndex];
    };


    var getColorFromContainer = function ($motifContainer) {
        var $picker = $motifContainer.children(".motif-color-picker");
        return $picker.spectrum("get").toHexString();
    };


    //add next default colorPicker to chosen motif
    var addTo = function ($motifContainer) {
        var $colorPicker = $('<input class="motif-color-picker">');

        $colorPicker.insertAfter($motifContainer.find('.close'));
        set($motifContainer.children(".motif-color-picker"));
    };


    var removeFrom = function (motifContainer) {
        motifContainer.children(".motif-color-picker").spectrum("destroy");
        motifContainer.children(".motif-color-picker").remove();
        _freeColorIndex -= 1;
    };


    //by default the colorPicker is "input" element

    var set = function (colorPicker) {
        var firstLine = _defaultColors.slice(0, 8),
            secondLine = _defaultColors.slice(8, 16);

        // firstLine.push("#AAAAAA");
        // secondLine.push("#4D4D4D");

        colorPicker.spectrum(
            {
                type: "color",
                className: "full-spectrum",
                color: lastFreeColor(),
                showInput: true,
                showAlpha: false,
                showSelectionPalette: false,
                showButtons: false,
                allowEmpty: false,
                clickoutFiresChange: true,
                preferredFormat: "hex",
                move: function (color) {},
                show: function () {},
                beforeShow: function () {},
                hide: function () {},
                change: function (){_eventHandler("COLOR")},
                palette: [
                  ["#f00","#f90","#ff0","#0f0",
                  "#0ff","#00f","#90f","#f0f"],

                  ["#ea9999","#f9cb9c","#ffe599","#b6d7a8",
                  "#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],

                  ["#e06666","#f6b26b","#ffd966","#93c47d",
                  "#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],

                  ["#c00","#e69138","#f1c232","#6aa84f",
                  "#45818e","#3d85c6","#674ea7","#a64d79"],

                  ["#900","#b45f06","#bf9000","#38761d",
                  "#134f5c","#0b5394","#351c75","#741b47"],

                  ["#600","#783f04","#7f6000","#274e13",
                  "#0c343d","#073763","#20124d","#4c1130"],

                  ["#d3ac85", "#b38c65", "#977049", "#7c5835",
                    "#66442c", "#4c2b21", "#2e1915", "#0f080e"],

                  ["#c6c6c6", "#aaa", "#8d8d8d", "#717171",
                  "#555", "#383838", "#1c1c1c", "#000"]
                ]
            });
        _freeColorIndex += 1;
    };


    return {
        create: create,
        addTo: addTo,
        removeFrom: removeFrom,

        getColorFromContainer: getColorFromContainer
    };
}());
