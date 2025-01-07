const $snbArea = document.body.querySelector(':scope > .container > .content > .snb_area');
const $ContentArea = document.body.querySelector(':scope > .container >.content > .content_area');
const $contactdiv = document.querySelector('.profile_group.contact > .unit');
const $ContactForm = document.querySelector('.contact_modify');

$contactdiv.querySelector(':scope > .unit_content > .button').onclick = () => {
    $ContactForm.show();
}

$ContactForm.querySelector(':scope > .modify_btn > .cancel').onclick = () => {
    $ContactForm.hide();
}

const $Modify = $ContentArea.querySelector(':scope > .my_profile > .profile_info > .profile_group > .modify') // div 태그

$ContentArea.querySelector(':scope > .my_profile > .profile_info > .profile_group > .unit > .unit_content > button.password').onclick = (e) => {
    e.preventDefault();
    $Modify.show();
};

$Modify.querySelector(':scope > .modify_btn > .button.cancel').onclick = (e) => {
    e.preventDefault();
    $Modify.hide();
}

$ContactForm.onsubmit = (e) => {
    e.preventDefault();
    const $ContactLabel = $ContactForm.findLabel('contact-label');
    $ContactLabel.setValid($ContactForm['contact'].value.length === 11, '올바른 전화번호를 입력해 주세요.');
    if (!$ContactLabel.isValid()) {
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', $ContactForm['userEmail'].value);
    formData.append('contact', $ContactForm['contact'].value);
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        Loading.hide()
        if (xhr.status < 200 || xhr.status >= 300) {
            return;
        }
        const response = JSON.parse(xhr.responseText);
        if (response['result'] === 'failure') {
            Dialog.show({
                title: '연락처',
                content: '알 수 없는 이유로 연락처 수정에 실패했습니다.',
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog),
                }]
            });
            return;
        }
        if (response['result'] === 'failure_duplicate_contact') {
            Dialog.show({
                title: '연락처',
                content: '이미 존재하는 연락처입니다. 다시 시도해 주세요',
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog),
                }]
            });
            return;
        }
        if (response['result'] === 'success') {
            Dialog.show({
                title: '연락처',
                content: '연락처 수정에 성공했습니다.',
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog),
                }]
            });
        }

    };
    xhr.open('PATCH', './modify-contact');
    xhr.send(formData);
    Loading.show(0);
}

$Modify.onsubmit = (e) => {
    e.preventDefault();
    const $passwordLabel = $Modify.findLabel('newPassword');
    $passwordLabel.setValid($Modify['newPassword'].value.length >= 6 && $Modify['newPassword'].value.length <= 50, '올바른 비밀번호를 입력해 주세요');
    if (!$passwordLabel.isValid()) {
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', $Modify['email'].value);
    formData.append('password', $Modify['password'].value);
    formData.append('newPassword', $Modify['newPassword'].value);
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
            failure: ['비밀번호 재설정', '비밀번호를 재설정할 수 없습니다. 링크가 올바르지 않거나 링크가 손상되었을 수 있습니다. <br><br>동일한 문제가 발복된다면 비밀번호 재설정 링크를 다시 생성해 주세요', ($dialog) => Dialog.hide($dialog)],
            failure_duplicate_password: ['비밀번호 재설정', '비밀번호를 재설정할 수 없습니다. 이전 비밀번호가 일치하지 않습니다.', ($dialog) => Dialog.hide($dialog)],
            success: ['비밀번호 재설정', '비밀번호를 성공적으로 재설정하였습니다. 확인 버튼을 클릭하면 로그인 페이지로 이동합니다.', () => location.href = '/'],
            social_password_failure: ['비밀번호 재설정', '소셜 계정은 비밀번호를 재설정할 수 없습니다.', ($dialog) => Dialog.hide($dialog)],
        }[response['result']] || ['오류', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세ㅛ.', ($dialog) => Dialog.hide($dialog)];
        Dialog.show({
            title: title, content: content, buttons: [{
                text: '확인', onclick: onclick
            }]
        });
    };
    xhr.open('PATCH', './recover-password');
    xhr.send(formData);

}





