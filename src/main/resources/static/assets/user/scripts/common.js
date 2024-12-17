HTMLElement.prototype.hide = function () {
    // HTML 요소에 '-visible' 클래스를 제거하여 숨김 처리
    this.classList.remove('-visible');
    return this; // 체이닝 가능하도록 자신을 반환
}

HTMLElement.prototype.show = function () {
    // HTML 요소에 '-visible' 클래스를 추가하여 보이도록 설정
    this.classList.add('-visible');
    return this; // 체이닝 가능하도록 자신을 반환
}
/**
 * HTMLFormElement 프로토타입에 findLabel 메서드 추가
 * @param {string} dataId - 찾을 레이블의 data-id 속성 값
 * @return {HTMLLabelElement} - 해당 data-id를 가진 레이블 요소를 반환
 */
HTMLFormElement.prototype.findLabel = function (dataId) {
    // 폼 요소 내에서 특정 data-id를 가진 레이블을 찾음
    return this.querySelector(`label.--obj-label[data-id="${dataId}"]`);
}

/**
 * HTMLLabelElement 프로토타입에 setValid 메서드 추가
 * @param {boolean} b - 유효성 상태 (true: 유효, false: 무효)
 * @param {string|undefined} warningText - 무효 상태일 경우 경고 텍스트
 * @return {HTMLLabelElement} - 메서드를 호출한 레이블 요소 반환
 */
HTMLLabelElement.prototype.setValid = function (b, warningText = undefined) {
    if (b === true) {
        // 유효 상태: '-invalid' 클래스 제거
        this.classList.remove('-invalid');
    } else if (b === false) {
        // 무효 상태: '-invalid' 클래스 추가
        this.classList.add('-invalid');
        if (typeof warningText === 'string') {
            // 경고 텍스트가 제공되었다면 '_warning' 요소의 텍스트로 설정
            this.querySelector(':scope > ._warning').innerText = warningText;
        }
    }
    return this; // 체이닝 가능하도록 자신을 반환
}

/**
 * HTMLLabelElement 프로토타입에 isValid 메서드 추가
 * @return {boolean} - 레이블이 유효한지 여부를 반환
 */
HTMLLabelElement.prototype.isValid = function () {
    // '-invalid' 클래스가 없는 경우 true 반환
    return !this.classList.contains('-invalid');
}


class Dialog {
    /** @type {HTMLElement} */
    static $cover;
    /** @type {Array<HTMLElement>} */
    static $dialogArray = [];

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
                    text: '취소', onclick: ($dialog) => {
                        Dialog.hide($dialog);
                        if (typeof onYes === 'function') {
                            onYes($dialog);
                        }
                    }
                },
                {
                    text: '확인', onclick: ($dialog) => {
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

class Loading {
    /**
     * @type {HTMLElement}
     * 로딩 상태를 표시하는 요소
     */
    static $element;

    /**
     * 로딩 상태를 숨기는 메서드
     */
    static hide() {
        Loading.$element?.hide(); // 로딩 요소가 존재하면 숨김
    }

    /**
     * 로딩 상태를 표시하는 메서드 (작성 중)
     * @param {number} delay - 표시 지연 시간
     */


    static show(delay = 50) {
        // 로딩 상태를 표시하는 정적 메서드, delay는 표시 지연 시간 (기본값 50ms)
        if (Loading.$element == null) {
            // 로딩 요소가 없을 경우, 새로 생성
            const $element = document.createElement('div'); // 로딩 컨테이너 요소 생성
            $element.classList.add('---loading'); // 로딩 컨테이너에 클래스 추가

            const $icon = document.createElement('img'); // 로딩 아이콘 요소 생성
            $icon.classList.add('_icon'); // 아이콘에 클래스 추가
            $icon.setAttribute('alt', ''); // alt 속성을 비워서 이미지가 로딩 실패 시 아무 텍스트도 표시되지 않도록 설정
            $icon.setAttribute('src', 'data:image/png;base64,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'); // Base64 인코딩된 이미지 소스 설정

            const $text = document.createElement('span'); // 로딩 텍스트 요소 생성
            $text.classList.add('_text'); // 텍스트 요소에 클래스 추가
            $text.innerText = '잠시만 기다려 주세요'; // 텍스트 설정

            $element.append($icon, $text); // 컨테이너에 아이콘과 텍스트 추가
            document.body.prepend($element); // 컨테이너를 문서의 최상단에 추가
            Loading.$element = $element; // 로딩 요소를 정적 속성으로 저장
        }
        setTimeout(() => Loading.$element.show(), delay);
        // 지정한 지연 시간 후 로딩 요소를 표시
    }


}