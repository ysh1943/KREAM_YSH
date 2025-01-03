const rows = document.querySelectorAll('tr');
rows.forEach(($tr) => {
    const updateButton = $tr.querySelector(':scope > td > button[name="update"]');
    if (updateButton) {
        updateButton.addEventListener('click', () => {

            const state = $tr.querySelector('.stateSelect').value;

            Dialog.defaultYesNo('변경', `주문 상태를 변경할까요?`, () => {
                // 이메일 값을 가져오고 상태값을 서버에 전송
                sendPatchRequest($tr.dataset['id'], state);
                console.log(state)
            });
        });
    }
});

const sendPatchRequest = (id, state) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('state', state);
    console.log(state)
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
                    buttons: [{
                        text: '확인', onclick: ($dialog) => {
                            Dialog.hide($dialog);
                            location.reload();
                        }
                    }]
                });
                break;
            default:
                alert('서버가 알 수 없는 응답을 반환하였습니다.');
                break;
        }
    };
    xhr.open('PATCH', '/admin/order');
    xhr.send(formData);
    Loading.show(0);
};

// const sendDeleteRequest = (id) => {
//     const xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState !== XMLHttpRequest.DONE) {
//             return;
//         }
//         if (xhr.status < 200 || xhr.status >= 300) {
//             Dialog.show({
//                 title: '오류',
//                 content: '정산완료 상태의 데이터를 삭제하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.',
//                 buttons: [{text: '확인', onclick: ($dialog) => Dialog.hide($dialog)}]
//             });
//             return;
//         }
//         const response = JSON.parse(xhr.responseText);
//         switch (response['result']) {
//             case 'failure':
//                 Dialog.show({
//                     title: '정산완료 삭제 실패',
//                     content: '정산완료 상태의 데이터를 삭제하는 데 실패하였습니다.',
//                     buttons: [{text: '확인', onclick: ($dialog) => Dialog.hide($dialog)}]
//                 });
//                 break;
//             case 'success':
//                 Dialog.show({
//                     title: '정산완료 삭제',
//                     content: '정산완료 상태의 데이터가 삭제되었습니다.',
//                     buttons: [{text: '확인', onclick: ($dialog) => {
//                             Dialog.hide($dialog);
//                             location.reload();
//                         }}]
//                 });
//                 break;
//             default:
//                 alert('서버가 알 수 없는 응답을 반환하였습니다.');
//                 break;
//         }
//     };
//     xhr.open('DELETE', '/admin/order');
//     xhr.send();
// };