const $main = document.getElementById('main');
const $content = $main.querySelector('.content');
const $tableForm = $content.querySelector('.tableForm');
const $table = $tableForm.querySelector('table');
const $tbody = $table.querySelector('tbody');
const $tr = $tbody.querySelector('tr');

const rows = document.querySelectorAll('tr');
rows.forEach(($tr) => {
    const updateButton = $tr.querySelector(':scope > td > button[name="update"]');
    if (updateButton) {
        updateButton.addEventListener('click', () => {
            // 해당 행에서 suspendSelect 값을 가져옴
            const suspend = $tr.querySelector('.suspendSelect').value;
            Dialog.defaultYesNo('변경', `정말로 회원의 계정 상태를 변경할까요?`, () => {
                // 이메일 값을 가져오고 상태값을 서버에 전송
                sendPatchRequest($tr.dataset['email'], suspend);
            });
        });
    }
});

const sendPatchRequest = (email, suspend) => {
    const formData = new FormData();
    formData.append('userEmail', email);
    formData.append('suspend', suspend);
    console.log(suspend);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        Loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            Dialog.show({
                title: '오류',
                content: '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.',
                buttons: [{text: '확인', onclick: ($dialog) => Dialog.hide($dialog)}]
            });
            return;
        }
        const response = JSON.parse(xhr.responseText);
        switch (response['result']) {
            case 'failure':
                Dialog.show({
                    title: '상태 변경',
                    content: '알 수 없는 이유로 상태 변경에 실패하였습니다. 잠시 후 다시 시도해 주세요.',
                    buttons: [{text: '확인', onclick: ($dialog) => Dialog.hide($dialog)}]
                });
                break;
            case 'success':
                Dialog.show({
                    title: '상태 변경',
                    content: '상태 변경이 완료되었습니다.',
                    buttons: [{text: '확인', onclick: ($dialog) => {
                            Dialog.hide($dialog);
                            location.reload();
                        }}]
                });
                break;
            default:
                alert('서버가 알 수 없는 응답을 반환하였습니다.');
                break;
        }
    };
    xhr.open('PATCH', '/admin/user');
    xhr.send(formData);
    Loading.show(0);
};

