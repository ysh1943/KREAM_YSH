const $form = document.body.querySelector(':scope > .container > .content > .login-area');

const $labels = document.querySelectorAll('.--obj-label');
$labels.forEach((label) => {
    const $input = label.querySelector('.item');
    const $clearButton = label.querySelector('.close');

    $input.addEventListener("input", () => {
        if ($input.value.length > 0) {
            $clearButton.classList.remove('-visible'); // 버튼 표시

        } else {
            $clearButton.classList.add('-visible'); // 버튼 숨기기
        }
    });

    // 버튼 클릭 시 입력 필드 초기화
    $clearButton.addEventListener("click", () => {
        $input.value = ""; // 초기화
        $clearButton.classList.add('-visible'); // 버튼 숨기기
    });

});


$form.onsubmit = (e) => {
    e.preventDefault();
    const $emaillabel = $form.findLabel('email');
    const $passwordlabel = $form.findLabel('password');
    $emaillabel.setValid($form['email'].value.length >= 8 && $form['email'].value.length <= 50);
    $passwordlabel.setValid($form['password'].value.length >= 6 && $form['password'].value.length < 50);
    if (!$emaillabel.isValid() || !$passwordlabel.isValid()) {
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', $form['email'].value);
    formData.append('password', $form['password'].value);
    // const url = new URL(location.href);
    // url.pathname = '/login';
    // url.searchParams.set('email', $form['email'].value);
    // url.searchParams.set('password', $form['password'].value);
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            Dialog.show({
                title: '로그인',
                content: '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.',
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog),
                }]
            });
            return;
        }
        const response = JSON.parse(xhr.responseText);
        if (response['result'] === 'success') {
            location.reload();
            return;
        }
        const [title, content, onclick] = {
            failure: ['로그인', '이메일 혹은 비밀번호가 올바르지 않습니다. 다시 확인해 주세요', ($dialog) => {
                Dialog.hide($dialog)
                $form['email'].focus();
                $form['email'].select();
            }],
            expired_password: ['로그인', '해당 계정의 임시비밀번호 기간이 만료되었습니다. 재발급 신청하시기 바랍니다.', ($dialog) => Dialog.hide(($dialog))],
            failure_not_verified: ['로그인', `해당 계정의 이메일 인증이 완료되지 않았습니다. 이메일을 확인해 주세요.<br><br>혹시 이메일이 오지 않았다면 인증링크가 포함된 이메일을 <a href="#" target="_blank">다시 전송</a>할 수 있습니다.`, ($dialog) => Dialog.hide($dialog)],
            failure_suspended: ['로그인', '해당 계정은 이용이 정지된 상태입니다. 관리자에게 문의해 주세요', ($dialog) => Dialog.hide(($dialog))],
        }[response['result']] || ['오류', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요', ($dialog) => Dialog.hide(($dialog))];
        Dialog.show({
            title: title,
            content: content,
            buttons: [{
                text: '확인', onclick: onclick
            }]
        });
    };
    xhr.open('POST', '/login');
    xhr.send(formData);
};




