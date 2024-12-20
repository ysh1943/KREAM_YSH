{
    const $form = document.body.querySelector(':scope > .container > .content > .helf-area');
    $form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('contact', $form['contact'].value);
        formData.append('email', $form['email'].value);

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                Dialog.show({
                    title: '오류',
                    content: '요청을 전송하는 도중 오류가 발생하였습니다 잠시 후 다시 시도해 주세요.',
                    buttons: [{
                        text: '확인',
                        onclick: ($dialog) => Dialog.hide($dialog),
                    }]
                });
                return;
            }
            const response = JSON.parse(xhr.responseText);

            const [title, content, onclick] = {
                failure: ['비밀번호 재설정', '입력하신 이메일과 계정 정보를 찾을 수 없습니다.', ($dialog) => Dialog.hide($dialog)],
                success: ['비밀번호', '입력하신 이메일로 임시 비밀번호를 전송하였습니다.<br>로그인 후 반드시 비밀번호를 변경해 주세요. 임시비밀번호는 1시간 이후 만료됩니다.', ($dialog) => {
                    Dialog.hide($dialog);
                }],
            }[response['result']] || ['오류', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요', ($dialog) => Dialog.hide($dialog)];
            Dialog.show({
                title: title,
                content: content,
                buttons: [{
                    text: '확인', onclick: onclick
                }]
            });
        };
        xhr.open('POST', `/find-password?contact=${$form['contact'].value}&email=${$form['email'].value}`);
        xhr.send();
    };
}


