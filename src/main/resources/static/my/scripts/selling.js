// 상태 텍스트를 담을 객체 (상태와 버튼 텍스트를 매핑)
const stateTextMap = {
    'all': '전체',
    'bidding': '입찰 중',
    'deadline': '기한만료',
    'pending': '대기중',
    'inspecting': '검수중',
    'inspection_passed': '검수 합격',
    'inspection_failed': '검수 불합격',
    'settling': '정산중',
    'failed': '취소완료',
    'settled': '정산완료'
};

// 레이어와 관련된 요소를 선택
const $myOrderBox = document.body.querySelector(':scope > .container > .content > .content_area > .my_Buying > .my_order_box');
const $myOrderBoxAll = document.body.querySelectorAll(':scope > .container > .content > .content_area > .my_Buying > .my_order_box');
const $layerButton = document.body.querySelector(':scope > .container > .content > .content_area > .my_Buying > .content_list > .bidding-header > .bidding > .purchase_head > .head_product > .btn_filter');
const $LinkArray = Array.from(document.body.querySelectorAll(':scope > .container > .content > .content_area > .my_Buying > .content_list > .bidding-header > .bidding > .purchase_list > .tab_item > .tab_link[rel]'));

// 레이어 관련 요소
const $layer = $myOrderBox.querySelector(':scope > .layer');
const $cover = $layer.querySelector(':scope > .layer_background');
const $closeButton = $layer.querySelector(':scope > .layer_container > .layer_close');  // x 버튼 선택

// 초기 상태에 맞는 버튼 텍스트 업데이트
function updateButtonText() {
    const urlparams = new URLSearchParams(window.location.search);
    const state = urlparams.get('state') || 'all'; // URL에서 'state' 값 가져오기, 없으면 'all' 기본값

    const $btnFilter = document.querySelector('.btn_filter');

    // 상태에 맞는 텍스트와 아이콘 업데이트
    $btnFilter.innerHTML = `${stateTextMap[state]} <img alt="downbutton" class="image" src="/my/images/icons8-down-button-50.png">`;
}

// 페이지 로드 시 초기 텍스트 업데이트
updateButtonText();

// showstate 함수
function showstate() {
    const urlparams = new URLSearchParams(window.location.search);
    const state = urlparams.get('state') || 'all'; // URL 파라미터에서 'state' 값 가져오기, 없으면 'all' 기본값

    // 상태에 맞는 텍스트와 아이콘 업데이트
    const $btnFilter = document.querySelector('.btn_filter');
    $btnFilter.innerHTML = `${stateTextMap[state]} <img alt="downbutton" class="image" src="/my/images/icons8-down-button-50.png">`;

    if (urlparams.has('orderState')) {
        $myOrderBoxAll[1].classList.add('-visible'); // orderState가 있으면 두 번째 박스를 보이게 함
    }
}

// 페이지 로드 시 상태 반영
showstate();

// 레이어 버튼 클릭 시
$layerButton.onclick = (e) => {
    e.preventDefault();

    // URL에서 state 파라미터를 가져옴, 없으면 'all' 기본값
    const urlparams = new URLSearchParams(window.location.search);
    const state = urlparams.get('state') || 'all'; // URL에서 state 파라미터 확인

    // 상태에 맞는 텍스트와 아이콘 업데이트
    const $btnFilter = document.querySelector('.btn_filter');
    $btnFilter.innerHTML = `${stateTextMap[state]} <img alt="downbutton" class="image" src="/my/images/icons8-down-button-50.png">`;

    // 레이어 보이기
    $layer.classList.add('-visible');
}

// 레이어 배경 클릭 시
$cover.onclick = () => {
    $layer.classList.remove('-visible'); // 레이어 닫기
}

// x 버튼 클릭 시
$closeButton.onclick = () => {
    $layer.classList.remove('-visible'); // x 버튼을 클릭하면 레이어 닫기
}

// myOrderBoxAll 각각에 대해 처리
$myOrderBoxAll.forEach((box, index) => {
    if (index === 0) {
        box.classList.add('-visible'); // 첫 번째 박스는 기본으로 보이게
    } else {
        box.classList.remove('-visible'); // 나머지는 숨김
    }
});

document.querySelectorAll('.product_list').forEach((link) => {
    // a 링크 클릭 이벤트
    link.addEventListener('click', (e) => {
        const deleteButton = link.querySelector('.delete_button');

        if (deleteButton && e.target.closest('.delete_button')) {
            e.preventDefault();
            const id = deleteButton.dataset.id;
            showDeleteDialog(id);
        }
    });
});

const showDeleteDialog = (id) => {
    Dialog.defaultYesNo('입찰 지우기', '등록하신 입찰을 지우시면 주문이 취소됩니다.', () => {
        deleteItem(id);
    });
};

const deleteItem = (id) => {
    console.log(`상품 삭제 ID: ${id}`);
    sendDeleteRequest(id);
};

const sendDeleteRequest = (id) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('id', id.toString());

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
                    title: '판매입찰 삭제',
                    content: '알 수 없는 이유로 판매입찰 삭제에 실패하였습니다. 잠시 후 다시 시도해 주세요.',
                    buttons: [{text: '확인', onclick: ($dialog) => Dialog.hide($dialog)}]
                });
                break;
            case 'success':
                Dialog.show({
                    title: '판매입찰 삭제',
                    content: '판매입찰 삭제가 완료되었습니다.',
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
    xhr.open('DELETE', '/my/selling');
    xhr.send(formData);
    Loading.show(0);
};

document.querySelectorAll('.order_product_list').forEach((link) => {
    // a 링크 클릭 이벤트
    link.addEventListener('click', (e) => {
        const deleteButton = link.querySelector('.update_button');

        if (deleteButton && e.target.closest('.update_button')) {
            e.preventDefault();
            const id = deleteButton.dataset.id;
            showUpdateDialog(id);
        }
    });
});

const showUpdateDialog = (id) => {
    Dialog.defaultYesNo('삭제', '이 상품의 거래를 취소하시겠습니까?', () => {
        updateItem(id);
    });
};

const updateItem = (id) => {
    console.log(`상품 삭제 ID: ${id}`);
    sendUpdateRequest(id);
};

const sendUpdateRequest = (id) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('id', id.toString());

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
                    title: '판매입찰 삭제',
                    content: '알 수 없는 이유로 판매입찰 삭제에 실패하였습니다. 잠시 후 다시 시도해 주세요.',
                    buttons: [{text: '확인', onclick: ($dialog) => Dialog.hide($dialog)}]
                });
                break;
            case 'success':
                Dialog.show({
                    title: '판매입찰 삭제',
                    content: '판매입찰 삭제가 완료되었습니다.',
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
    xhr.open('PATCH', '/my/selling');
    xhr.send(formData);
    Loading.show(0);
};