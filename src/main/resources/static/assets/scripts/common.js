HTMLElement.prototype.hide = function () {
    this.classList.remove('-visible');
    return this;
}

HTMLElement.prototype.show = function () {
    this.classList.add('-visible');
    return this;
}

class Dialog {
    /** @type {HTMLElement} */
    static $cover;
    /** @type {Array<HTMLElement>} */
    static $dialogArray = [];

    /**
     * @param {string} title
     * @param {string} content
     * @param {function(HTMLElement)|undefined} onclick */
    static defaultOk(title, content, onclick = undefined) {
        Dialog.show({
            title: title,
            content: content,
            buttons: [{
                text: '확인', onclick: ($dialog) => {
                    Dialog.hide($dialog);
                    if (typeof onclick === 'function') {
                        onclick($dialog);
                    }
                }
            }]
        });
    }

    /**
     *
     * @param {string} title
     * @param {string} content
     * @param {function(HTMLElement)|undefined} onYes
     * @param {function(HTMLElement)|undefined} onNo
     */
    static defaultYesNo(title, content, onYes = undefined, onNo = undefined) {
        Dialog.show({
            title: title,
            content: content,
            buttons: [
                {
                    text: '확인', onclick: ($dialog) => {
                        Dialog.hide($dialog);
                        if (typeof onYes === 'function') {
                            onYes($dialog);
                        }
                    }
                },
                {
                    text: '취소', onclick: ($dialog) => {
                        Dialog.hide($dialog);
                        if (typeof onNo === 'function') {
                            onNo($dialog);
                        }
                    }
                }
            ]
        });
    }

    /**
     * @param {HTMLElement} $dialog
     */
    static hide($dialog) {
        Dialog.$dialogArray.splice(Dialog.$dialogArray.indexOf($dialog), 1);
        if (Dialog.$dialogArray.length === 0) {
            Dialog.$cover.hide();
        }
        $dialog.hide();
        setTimeout(() => $dialog.remove(), 1000);
    }

    /**
     * @param {Object} args
     * @param {string} args.title
     * @param {string} args.content
     * @param {Array<{string, function}>|undefined} args.buttons
     * @param {number} delay
     * @returns {HTMLElement}
     */
    static show(args, delay = 50) {
        const $dialog = document.createElement('div');
        $dialog.classList.add('---dialog');
        const $title = document.createElement('div');
        $title.classList.add('_title');
        $title.innerText = args.title;
        const $content = document.createElement('div');
        $content.classList.add('_content');
        $content.innerHTML = args.content;
        $dialog.append($title, $content);
        if (args.buttons != null && args.buttons.length > 0) {
            const $buttonContainer = document.createElement('div');
            $buttonContainer.classList.add('_button-container');
            $buttonContainer.style.gridTemplateColumns = `repeat(${args.buttons.length}, 1fr)`;
            for (const button of args.buttons) {
                const $button = document.createElement('button');
                $button.classList.add('_button');
                $button.setAttribute('type', 'button');
                $button.innerText = button.text;
                if (typeof button.onclick === 'function') {
                    $button.onclick = () => button.onclick($dialog);
                }
                $buttonContainer.append($button);
            }
            $dialog.append($buttonContainer);
        }
        document.body.prepend($dialog);
        Dialog.$dialogArray.push($dialog);
        if (Dialog.$cover == null) {
            const $cover = document.createElement('div');
            $cover.classList.add('---dialog-cover');
            document.body.prepend($cover);
            Dialog.$cover = $cover;
        }
        setTimeout(() => {
            $dialog.show();
            Dialog.$cover.show();
        }, delay);
        return $dialog;
    }
}