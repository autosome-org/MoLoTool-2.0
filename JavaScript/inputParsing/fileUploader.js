let fileUploader = (function () {
  let _fileName = "fileUploader",

      $uploadContainer = $('#upload-container'),
      $fileInput = $('#file-input'),
      $inputTextarea = $('#input_textarea'),
      $inputButton = $('#input_button');


  let create = function () {
    if ( ifSupported() )
      setup();
    else
      errorHandler.logError({"fileName": _fileName, "message": "warning: file can't be loaded in this browser"});
  };


  let ifSupported = function () {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      return true;
    } else {
      alert('The File APIs are not fully supported in this browser.');
      return false;
    }
  };


  let calculateSize = function (file) {
    let nBytes = file.size,
        sOutput = nBytes + " bytes";
    // optional code for multiples approximation
    for (let aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
             nMultiple = 0, nApprox = nBytes / 1024;
         nApprox > 1; nApprox /= 1024, nMultiple++) {
      sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
    }

    console.log(sOutput, "file size.\n");
    return nBytes;
  };


  let setup = function () {
    $(document).on({
      dragover: function() {
        return false;
      },
      drop: function() {
        return false;
      }
    });

    $fileInput.on('change', function(event) {
      handleFile(event.target.files[0]);
    });

    $uploadContainer.on({
      'drop': function(event) {
        $uploadContainer.removeClass('dragover');
        handleFile(event.originalEvent.dataTransfer.files[0]);
      },
      'dragover dragenter': function() {
        $uploadContainer.addClass('dragover');
      },
      'dragleave': function(event) {
        let dx = event.pageX - $uploadContainer.offset().left;
        let dy = event.pageY - $uploadContainer.offset().top;
        if ((dx < 0) || (dx > $uploadContainer.width()) || (dy < 0) || (dy > $uploadContainer.height())) {
          $uploadContainer.removeClass('dragover');
        }
      }
    });

    $uploadContainer.on('drag dragstart dragend dragover dragenter dragleave drop', function() {
      return false;
    });

  };


  let handleFile = function(file) {
    let fileSize = calculateSize(file);

    console.log(file.name, "name");

    if (fileSize > 20480) {
      console.log("Error: too big file uploaded (> 20 kb).");
      inputErrors.addToLog("fileIsTooBig");
      inputErrors.showErrors();
    } else {
      let reader = new FileReader();

      reader.onload = function() {
        $inputTextarea.val(reader.result);
        $inputButton.click();
      };

      reader.readAsText(file);
    }
  };


  return {
    create
  };
}());