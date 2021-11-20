let clipboardCopy = (function () {
    let _fileName = 'clipboardCopy',
        clipboard;

    let create = function () {
        clipboard = new Clipboard('.copy', {
            target: function(trigger) {
                if ( comparisonMode.getCurrentMode() === 'Single' ) {
                    let wrapper = singleModeTextGenerator.generateObjectToCopy();
                    document.body.append(wrapper);

                    return wrapper;
                }

                let tabId = trigger.getAttribute('data-tab');

                return $(`.tab-result-sequence[data-tab=${tabId}]`)[0];
            }
        });

        clipboard.on('success', function(event) {
            $('.object-to-copy').remove();
            console.info('Action:', event.action);
            console.info('Text:', event.text);
            console.info('Trigger:', event.trigger);

            setTimeout(function () {
                event.clearSelection();
            }, 150);
        });
    };

    return {
        create
    };
} ());
