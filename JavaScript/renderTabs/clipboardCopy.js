var clipboardCopy = (function () {
    var _fileName = "clipboardCopy",
        clipboard;

    var create = function () {
        clipboard = new Clipboard('.copy', {
            target: function(trigger) {
                var tabId = trigger.getAttribute("data-tab");
                return $(".tab-result-sequence[data-tab=" + tabId + "]")[0];
            }
        });

        clipboard.on('success', function(event) {
            console.info('Action:', event.action);
            console.info('Text:', event.text);
            console.info('Trigger:', event.trigger);

            setTimeout(function () {
                event.clearSelection();
            }, 150);
        });
    };

    return {
        create: create
    };
} ());
