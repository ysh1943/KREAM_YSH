const _isSocialRegister = document.head.querySelector(':scope > meta[name="_isSocialRegister"]')?.getAttribute('content') === 'true';
const $form = document.body.querySelector(':scope > .container > .content >.register-form');
const $firstInput = document.getElementById('all');
const $secondCheckbox = $form.querySelectorAll(':scope > .join-terms > .item > .agree')

// 모두 동의를 눌렀을 때의 조건.
$firstInput.addEventListener('change', function () {
    const ischecked = $firstInput.checked;
    $secondCheckbox.forEach(checkbox => {
        checkbox.checked = ischecked;
    })
})

// 개별 상태가 모두 체크 되면 모든 체크 '동기화'
$secondCheckbox.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        $firstInput.checked = Array.from($secondCheckbox).every(checkbox => checkbox.checked);
    })
});

$form.onsubmit = (e) => {
    e.preventDefault();
    const $emailLabel = $form.findLabel('email');
    const $passwordLabel = $form.findLabel('password');
    const $nicknameLabel = $form.findLabel('nickname');
    const $contactLabel = $form.findLabel('contact');

    $emailLabel.setValid($form['email'].value.length >= 8 && $form['email'].value.length <= 50);
    $nicknameLabel.setValid($form['nickname'].value.length >= 2 && $form['nickname'].value.length <= 10);
    $contactLabel.setValid($form['contact'].value.length >= 10 && $form['contact'].value.length <= 12);
    if (!$emailLabel.isValid() || !$nicknameLabel.isValid() || !$contactLabel.isValid()) {
        return;
    }
    if (_isSocialRegister === false) { // 소셜 계정은 아래 검사를 하지 않겠다.
        $passwordLabel.setValid($form['password'].value.length >= 6 && $form['password'].value.length <= 50);
        if ($passwordLabel.isValid()) {
            $passwordLabel.setValid($form['password'].value === $form['passwordCheck'].value, '비밀번호가 서로 일치하지 않습니다.');
        }
        if (!$passwordLabel.isValid()) {
            return;
        }
    }

    if (!($form['agree'].checked)) {
        Dialog.show({
            title: '회원가입',
            content: '서비스 이용약관 및 개인정보 처리방침에 동의하지 않으면 회원가입을 하실 수 없습니다.',
            buttons: [{
                text: '확인', onclick: ($dialog) => Dialog.hide($dialog),
            }]
        });
        return;
    }

    const formData = new FormData();
    formData.append('email', $form['email'].value);
    formData.append('nickname', $form['nickname'].value);
    formData.append('contact', $form['contact'].value);
    if (_isSocialRegister === true) {
        formData.append('socialTypeCode', $form['socialTypeCode'].value);
        formData.append('socialId', $form['socialId'].value);
    } else {
        formData.append('password', $form['password'].value);

    }

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            Dialog.show({
                title: '회원가입',
                content: '알 수 없는 이유로 회원가입에 실패하였습니다. 잠시 후 다시 시도해 주세요.',
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog),
                }]
            });
            return;
        }
        const response = JSON.parse(xhr.responseText);
        const [title, content, onclick] = {
            failure: ['회원가입', '알 수 없는 이유로 회원가입에 실패하였습니다. 잠시 후 다시 시도해 주세요', ($dialog) => Dialog.hide($dialog)],
            failure_duplicate_email: ['회원가입', `입력하신 이메일${$form['email'].value}은 이미 사용중입니다. 다른 이메일을 사용해 주세요`, ($dialog) => Dialog.hide($dialog)],
            failure_duplicate_contact: ['회원가입', `입력하신 연락처${$form['contact'].value}은 이미 사용중입니다. 다른 연락처 사용해 주세요 `, ($dialog) => Dialog.hide($dialog)],
            failure_duplicate_nickname: ['회원가입', `입력하신 닉네임${$form['nickname'].value}은 이미 사용중입니다. 다른 닉네임 사용해 주세요`, ($dialog) => Dialog.hide($dialog)],
            success: ['회원가입', '회원가입해 주셔서 감사합니다. 입력하신 이메일로 계정을 인증할 수 있는 링크를 전송하였습니다. 계정 인증 후 로그인할 수 있으며, 해당 링크는 24시간 동안만 유효하니 유의해 주세요', ($dialog) => {
                Dialog.hide($dialog)
                location.href = '/user/';
            }],
        }[response['result']] || ['오류', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog)];
        Dialog.show({
            title: title,
            content: content,
            buttons: [{
                text: '확인',
                onclick: onclick
            }]
        });


    }
    xhr.open('POST', _isSocialRegister === true ? '../join' : './join');
    xhr.send(formData);
}
