const $MyAddressBook = document.body.querySelector(':scope > .container > .content > .content_area > .my_addressBook')
const $ContentArea = document.body.querySelector(':scope > .container > .content > .content_area');
const $layer = $MyAddressBook.querySelector(':scope > .layer');
const $layerModify = $MyAddressBook.querySelector(':scope > .layer.modify');
const $cover = document.getElementById('cover')
const $coverModify = document.getElementById('cover-modify')
const $AddressForm = $layer.querySelector(':scope > .layer_container');
const $ModifyForm = $layerModify.querySelector(':scope > .layer_container');

const $postalBtn = document.getElementById('btn');
$postalBtn.addEventListener('click', () => {
    new daum.Postcode({
        oncomplete: function (data) {
            $AddressForm['postal'].value = data.zonecode;
            $AddressForm['basicAddress'].value = data.address;
            if (data.buildingName !== '') {
                $AddressForm['basicAddress'].value += '(' + data.buildingName + ')';
            }
        }
    }).open();
});

const $postalModifyBtn = document.getElementById('btn postal');
$postalModifyBtn.addEventListener('click', () => {
    new daum.Postcode({
        oncomplete: function (data) {
            $ModifyForm['postal'].value = data.zonecode;
            $ModifyForm['basicAddress'].value = data.address;
            if (data.buildingName !== '') {
                $ModifyForm['basicAddress'].value += '(' + data.buildingName + ')';
            }
        }
    }).open();
});

$AddressForm.querySelector(':scope > .close').onclick = (e) => {
    e.preventDefault();
    $layer.hide();
}

// $MyAddressBook.querySelector(':scope > .content_title.dom > .btn_box > .btn').onclick = (e) => {
//     e.preventDefault();
//     $cover.onclick = () => {
//         $layer.hide();
//     }
//     $layer.show();
// }
$layer.querySelector(':scope > .layer_container > .layer_content > .layer_btn >.close').onclick = (e) => {
    e.preventDefault();
    $layer.hide();
}

$layerModify.querySelector(':scope > .layer_container > .layer_content > .layer_btn >.close').onclick = (e) => {
    e.preventDefault();
    $layerModify.hide();
}

const $Mylist = $ContentArea.querySelector(':scope > .my_addressBook > .my_list');

const ArrayAddress = (address) => {
    const $MyList = new DOMParser().parseFromString(
        `<div class="my_list">
                    <div class="basic">
                        <div class="my_item">
                            <div class="info_bind">
                                <div class="address_info">
                                    <div class="name_box">
                                        <span class="name">${address['name']}</span>
                                        <span class="mark">기본 배송지</span>
                                    </div>
                                    <p class="phone">
                                        ${address['contact'].slice(0, 3)}
                                        <span class="hyphen"></span>
                                        ${address['contact'].slice(3, 7)}
                                        <span class="hyphen"></span>
                                        ${address['contact'].slice(7)}
                                    </p>
                                    <div class="address_box">
                                        <div class="zipcode">(${address['postal']})</div>
                                        <div class="address">${address['basicAddress']}${address['detailAddress']}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="btn_bind">
                                <button class="button modify" type="submit">수정</button>
                                <button class="button delete" type="submit">삭제</button>
                            </div>
                        </div>
                    </div>
                </div>`, "text/html"
    ).querySelector('.my_list');
    $MyList.querySelector(':scope > .basic > .my_item > .btn_bind > .button.modify').onclick = (e) => {
        e.preventDefault();
        $coverModify.onclick = () => {
            $coverModify.hide();
            $layerModify.hide();
        }
        $ModifyForm.querySelector(':scope > .close').onclick = (e) => {
            e.preventDefault();
            $layerModify.hide();
        }

        $layerModify.show();
        /** @type {HTMLFontElement} */
        const $form = $layerModify.querySelector(':scope > form');
        $form['id'].value = address['id'];
        $form['name'].value = address['name'];
        $form['postal'].value = address['postal'];
        $form['contact'].value = address['contact'];
        $form['basicAddress'].value = address['basicAddress'];
        $form['detailAddress'].value = address['detailAddress'];

        $form.onsubmit = (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('id', $form['id'].value);
            formData.append('name', $form['name'].value);
            formData.append('contact', $form['contact'].value);
            formData.append('postal', $form['postal'].value);
            formData.append('basicAddress', $form['basicAddress'].value);
            formData.append('detailAddress', $form['detailAddress'].value);
            formData.append('setDefault', check2.checked);
            formData.append('userId', address['userId']);

            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
                Loading.hide();
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
                if (response['result'] === 'failure') {
                    Dialog.show({
                        title: '주소록',
                        content: '올바른 주소형식이 아닙니다 다시 입력해 주세요',
                        buttons: [{
                            text: '확인',
                            onclick: ($dialog) => Dialog.hide($dialog),
                        }]
                    });
                }
                if (response['result'] === 'failure_duplicate_address') {
                    Dialog.show({
                        title: '주소록',
                        content: '이미 존재하는 주소입니다. 다시 입력해 주세요',
                        buttons: [{
                            text: '확인',
                            onclick: ($dialog) => Dialog.hide($dialog),
                        }]
                    });
                }
                if (response['result'] === 'failure_duplicate_contact') {
                    Dialog.show({
                        title: '주소록',
                        content: '이미 존재하는 전화번호입니다. 다시 입력해 주세요',
                        buttons: [{
                            text: '확인',
                            onclick: ($dialog) => Dialog.hide($dialog),

                        }]
                    });
                }
                if (response['result'] === 'success') {
                    Dialog.show({
                        title: '주소록',
                        content: '주소를 변경하였습니다.',
                        buttons: [{
                            text: '확인',
                            onclick: ($dialog) => Dialog.hide($dialog),
                        }]
                    });
                }
            };
            xhr.open('PATCH', './address-modify');
            xhr.send(formData);
            Loading.show(0)
        };
    }
    $MyList.querySelector(':scope > .basic > .my_item > .btn_bind > .button.delete').onclick = (e) => {
        e.preventDefault();
        const $form = $layerModify.querySelector(':scope > form');
        $form['id'].value = address['id'];

        const formData = new FormData();
        formData.append('id', $form['id'].value);

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
            if (response['result'] === 'failure') {
                Dialog.show({
                    title: '삭제',
                    content: '삭제된 주소 또는 없는 주소입니다 다시 시도해 주세요.',
                    buttons: [{
                        text: '확인',
                        onclick: ($dialog) => Dialog.hide($dialog),
                    }]
                });
                return;
            }
            if (response['result'] === 'success') {
                location.reload();
            }

        };
        xhr.open('DELETE', './address-delete');
        xhr.send(formData);
    }

    $MyAddressBook.append($MyList);
    const $Mark = $MyList.querySelector('.mark');
    if (address['default'] === true) {
        $Mark.style.display = 'flex';
    }
    return $MyList;
}
const $Contenttitle = $MyAddressBook.querySelector(':scope > .content_title.dom');

const loadAddress = () => {

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            return;
        }
        const allAddress = JSON.parse(xhr.responseText);
        if (allAddress.length === 0) {
            $Contenttitle.innerHTML = `
                <div class="title">
                    <h3>주소록</h3>
                </div>
                <div class="btn_box">
                    <span>배송지 정보가 없습니다.<br>새 배송지를 등록해주세요</span>
                    <button class="btn">
                        <span class="btn_txt">새 배송지 추가</span>
                    </button>
                </div>`;
        } else {
            $Contenttitle.classList.remove('dom');
            $Contenttitle.innerHTML = `
                    <div class="title">
                        <h3>주소록</h3>
                    </div>
                    <div class="btn_box">
                        <button class="btn">
                            <span class="btn_txt">새 배송지 추가</span>
                        </button>
                    </div>`;
            for (const address of allAddress) {
                ArrayAddress(address);

            }
        }
        $Contenttitle.querySelector('.btn').onclick = (e) => {
            e.preventDefault();
            $cover.onclick = () => {
                $layer.hide();
            }
            $layer.show();
        }



    }
    xhr.open('GET', `./address/`);
    xhr.send();
};
loadAddress();

$AddressForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userId', $AddressForm['userId'].value);
    formData.append('name', $AddressForm['name'].value);
    formData.append('contact', $AddressForm['contact'].value);
    formData.append('postal', $AddressForm['postal'].value);
    formData.append('basicAddress', $AddressForm['basicAddress'].value);
    formData.append('detailAddress', $AddressForm['detailAddress'].value);
    formData.append('setDefault', check1.checked);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        Loading.hide();
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
        if (response['result'] === 'failure') {
            Dialog.show({
                title: '주소록',
                content: '올바른 주소형식이 아닙니다 다시 입력해 주세요',
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog),
                }]
            });
        }
        if (response['result'] === 'failure_duplicate_address') {
            Dialog.show({
                title: '주소록',
                content: '이미 존재하는 주소입니다. 다시 입력해 주세요',
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog),
                }]
            });
        }
        if (response['result'] === 'failure_duplicate_contact') {
            Dialog.show({
                title: '주소록',
                content: '이미 존재하는 전화번호입니다. 다시 입력해 주세요',
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog),

                }]
            });
        }
        if (response['result'] === 'success') {
            Dialog.show({
                title: '주소록',
                content: '새로운 주소를 등록합니다',
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog),
                }]
            });
            loadAddress();
            location.reload();
        }
    };
    xhr.open('POST', '/my/address');
    xhr.send(formData);
    Loading.show(0)
}

// 주소 ID
// const addressId = () => {
//     $Mylist.innerHTML = '';
//     const xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState !== XMLHttpRequest.DONE) {
//             return;
//         }
//         if (xhr.status < 200 || xhr.status >= 300) {
//
//             return;
//         }
//         const Address = JSON.parse(xhr.responseText);
//             ArrayAddress(Address);
//
//     };
//     xhr.open('GET', `./address-modify/`);
//     xhr.send();
// }
// addressId();

// $ModifyForm.onsubmit = (e) => {
//     e.preventDefault();
// }

