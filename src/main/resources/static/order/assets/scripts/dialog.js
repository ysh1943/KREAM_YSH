const $layer = document.querySelector('.layer');
const $cover = document.getElementById('cover');
const $allCancel = $layer.querySelector(':scope > .layer_container > .close');
const $addressForm = $layer.querySelector(':scope > .layer_container');
const $title = $addressForm.querySelector(':scope > .layer_header > .title');
const $addressList = $addressForm.querySelector(':scope > .address-list-container');
const $layerContent = $addressForm.querySelector(':scope > .layer_content');
const $cancel = $layerContent.querySelector(':scope > .layer_btn > .close');


//region 주소 변경, 추가
{
    const $nextPage = document.querySelector('.next-page');
    const $addressButton = $nextPage.querySelector(':scope > .address-container > .address-title-wrap > .address-button');

    function addressLoad() {
        const $inputText = document.querySelectorAll('.input-text');
        $inputText.forEach((x) => x.value = '');

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                Dialog.defaultOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog));
                return;
            }
            const allAddress = JSON.parse(xhr.responseText);

            $addressList.innerHTML = '';

            const $addButton = document.createElement('button');
            $addButton.classList.add('add-address');
            $addButton.type = 'button';
            const $text = document.createElement('span');
            $text.classList.add('text');
            $text.innerText = '+ 새 주소 추가하기';
            $addButton.append($text);
            $addressList.append($addButton);

            $addButton.onclick = () => {
                $title.innerText = '주소 추가하기'
                $addressList.style.display = 'none';
                $layerContent.style.display = 'flex';
            }

            if (allAddress.length === 0) {
                $addButton.click();
            }

            for (const address of allAddress) {
                const $addressItem = new DOMParser().parseFromString(`
            <div class="address-item">
                <label class="label">
                <span class="address-info">
                    <span class="name-wrap">
                        <span class="name">${address['name']}</span>
                    </span>
                    <span class="text">(${address['postal']})${address['basicAddress']}${address['detailAddress']}</span>
                    <span class="contact">${address['contact'].slice(0, 3)}-
                                        ${address['contact'].slice(3, 7)}-
                                        ${address['contact'].slice(7)}</span>
                </span>
                    <input class="_input" type="checkbox" name="check">
                    <span class="_box"></span>
                </label>
            </div>`, "text/html").querySelector('.address-item');
                $addressList.append($addressItem);

                //주소 선택
                $addressItem.onclick = () => {

                    const $emptyAddressContentWrap = $addressContainer.querySelector
                    (':scope > .address-content-wrap');
                    if ($emptyAddressContentWrap) {
                        $emptyAddressContentWrap.remove();
                    }
                    const $newAddressContentWrap = new DOMParser().parseFromString(`
            <div class="address-content-wrap">
                <input type="hidden" name="address-id" value="${address['id']}">
                <label class="label">
                    <span class="title">받는 분</span>
                    <input readonly maxlength="10" minlength="1" type="text" name="name" class="name" value="${address['name']}">
                </label>
                <label class="label">
                    <span class="title">연락처</span>
                    <input readonly maxlength="11" minlength="10" type="tel" name="contact" class="contact" value="${address['contact'].slice(0, 3)}-${address['contact'].slice(3, 7)}-${address['contact'].slice(7)}">
                </label>
                <label class="label">
                    <span class="title">주소</span>
                    <input readonly maxlength=50 minlength="20" type="text" name="address" class="address" value="[${address['postal']}] ${address['basicAddress']}${address['detailAddress']}">
                </label>
            </div>
        `, 'text/html').querySelector('.address-content-wrap');

                    const $addressContentWrap = $addressContainer.querySelector
                    (':scope > .address-content-wrap');
                    if ($addressContentWrap) {
                        $addressContentWrap.replaceWith($newAddressContentWrap);
                    } else {
                        $addressContainer.append($newAddressContentWrap);
                    }

                    $layer.hide();
                    $lastOrderButton.style.cursor = 'pointer';
                    $lastOrderButton.style.pointerEvents = '';
                }
            }
        }
        xhr.open('GET', `./my/address/`);
        xhr.send();
    }

    $addressButton.onclick = (e) => {
        e.preventDefault();
        $cover.onclick = () => $layer.hide();
        $allCancel.onclick = () => $layer.hide();
        addressLoad();
        $layer.show();
    }


    $cancel.onclick = () => {
        $addressList.style.display = 'flex';
        $layerContent.style.display = 'none';
    }

    const $postalBtn = document.getElementById('btn');
    $postalBtn.addEventListener('click', () => {
        new daum.Postcode({
            oncomplete: function (data) {
                $addressForm['postal'].value = data.zonecode;
                $addressForm['basicAddress'].value = data.address;
                if (data.buildingName !== '') {
                    $addressForm['basicAddress'].value += '(' + data.buildingName + ')';
                }
            }
        }).open();
    });

    $addressForm.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userId', $addressForm['userId'].value);
        formData.append('name', $addressForm['name'].value);
        formData.append('contact', $addressForm['contact'].value);
        formData.append('postal', $addressForm['postal'].value);
        formData.append('basicAddress', $addressForm['basicAddress'].value);
        formData.append('detailAddress', $addressForm['detailAddress'].value);

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

                $addressList.style.display = 'flex';
                $layerContent.style.display = 'none';
                addressLoad();
            }
        };
        xhr.open('POST', '/my/address');
        xhr.send(formData);
    }
}
//endregion

{
    const $accountForm = document.querySelector('.account-dialog > .account-form');
    const $nextPage = document.querySelector('.next-page');
    const $accountDialog = document.querySelector('.account-dialog');
    const $accountCover = $accountDialog.querySelector(':scope > .account-cover');
    const $accountCancel = $accountDialog.querySelector(':scope > .account-form > .close');
    const $accountButton = $nextPage.querySelector(':scope > .account-container > .account-title-wrap > .account-button');
    const $accountContainer = $nextPage.querySelector(':scope > .account-container');
    const $accountButtonText = $accountContainer.querySelector(':scope  > .account-title-wrap > .account-button > .account-button-text')

    $accountButton.onclick = () => {
        $accountCover.onclick = () => $accountDialog.hide();
        $accountCancel.onclick = () => $accountDialog.hide();
        $accountDialog.show();
        accountLoad();
    }

    // 은행 리스트
    function dropList() {
        const $layerDropdown = $accountForm.querySelector(':scope > .dialog-main > .input_box > .--obj-label > .layerDropdown');
        const $button = $accountForm.querySelector(':scope > .dialog-main > .input_box > .--obj-label > .btn');
        const $dropLink = $layerDropdown.querySelectorAll(':scope > .layer_container > .layer_content > .drop_list > .drop_item > .drop_link');
        const $SelectBank = document.getElementById('selectedBank');
        let isDropdownVisible = false;
        const toggleDropdown = () => {
            if (isDropdownVisible) {
                $layerDropdown.hide();
                isDropdownVisible = false;
            } else {
                $layerDropdown.show();
                isDropdownVisible = true;
            }
        }
        $button.addEventListener('click', (e) => {
            e.preventDefault();
            toggleDropdown();
        });
        $dropLink.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                $SelectBank.value = link.textContent.trim();
                $layerDropdown.hide(); // 드롭다운 숨김
                isDropdownVisible = false; // 상태 업데이트
            });
        });
    }

    // 계좌 GET
    function accountView() {
        // DB에 새로 등록 된거를 GET

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                Dialog.defaultOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog))
                return;
            }
            const response = JSON.parse(xhr.responseText);
            let $newAccountContentWrap;
            if (response['result'] === 'empty') {
                $newAccountContentWrap = new DOMParser().parseFromString(`
                                        <div class="account-content-wrap">
                                            <div class="empty-text">등록된 판매 정산 계좌가 없습니다.</div>
                                            <div class="empty-text">새 계좌번호를 추가해주세요.</div>    
                                        </div>
                                        `, "text/html").querySelector('.account-content-wrap');
                $accountButtonText.innerText = '계좌추가';
                $lastOrderButton.style.pointerEvents = 'none';
                $lastOrderButton.style.background = '#22222230';
                $lastOrderButton.style.cursor = 'not-allowed';
            } else {
                 $newAccountContentWrap = new DOMParser().parseFromString(`
                                        <div class="account-content-wrap">
                                            <label class="label">
                                                <span class="account-title">계좌</span>
                                                <input readonly maxlength="25" minlength="15" type="text" name="account" class="account input" value="${response['bankName']} ${response['accountNumber']}">
                                            </label>
                                            <label class="label">
                                                <span class="account-title">예금주</span>
                                                <input readonly maxlength="10" minlength="1" type="text" name="name" class="name input" value="${response['accountOwner']}">
                                            </label>
                                            <input type="hidden" name="account-id" value="${response['id']}"
                                        </div>
                                        `, "text/html").querySelector('.account-content-wrap');
                $accountButtonText.innerText = '변경';
            }

            const oldAccountContentWrap = document.querySelector('.account-content-wrap');
            if (oldAccountContentWrap) {
                $accountContainer.replaceChild($newAccountContentWrap, oldAccountContentWrap);
            } else {
                $accountContainer.appendChild($newAccountContentWrap);
            }
        };
        xhr.open('GET', `/account?user-id=${$form['user-id'].value}`);
        xhr.send();
    }

    // 계좌 등록
    function accountRegistration() {
        $accountForm.onsubmit = (e) => {
            e.preventDefault();
            const $bankNumberLabel = $accountForm.findLabel('bankNumber');
            const $nameLabel = $accountForm.findLabel('name');
            const $bankName = $accountForm.findLabel('bankName');

            // $bankName.setValid($accountForm['bankName'].value.trim(), '은행명을 선택해주세요');
            $bankNumberLabel.setValid($accountForm['account-number'].value.length > 6 && $accountForm['account-number'].value.length < 16, '올바른 계좌번호를 입력해 주세요');
            $nameLabel.setValid($accountForm['account-owner'].value.length > 1 && $accountForm['account-owner'].value.length < 10, '올바른 이름을 입력해주세요');
            if (!$bankName.isValid() || !$nameLabel.isValid() || !$bankNumberLabel.isValid()) {
                return;
            }
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('userId', $accountForm['user-id'].value);
            formData.append('bankName', $accountForm['bank-name'].value);
            formData.append('accountNumber', $accountForm['account-number'].value);
            formData.append('accountOwner', $accountForm['account-owner'].value);

            xhr.onreadystatechange = () => {
                if (xhr.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
                if (xhr.status < 200 || xhr.status >= 300) {
                    Dialog.defaultOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog));
                    return;
                }

                const response = JSON.parse(xhr.responseText);
                if (response['result'] === 'failure') {
                    Dialog.defaultOk('판매 정산 계좌', '등록된 계좌가 존재합니다. 삭제후 재등록 해 주시기 바랍니다.', ($dialog) => Dialog.hide($dialog));
                } else if (response['result'] === 'success') {
                    $firstPage.style.display = 'none';
                    $nextPage.style.display = 'flex';
                    $accountDialog.hide();

                    accountView();
                } else {
                    Dialog.defaultOk('오류', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog));
                }
            }
            xhr.open('POST', './my/account');
            xhr.send(formData);
        }
    }

    function accountLoad() {
        const $inputText = document.querySelectorAll('.input_txt');
        $inputText.forEach((x) => x.value = '');

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                Dialog.defaultOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog));
                return;
            }
            const response = JSON.parse(xhr.responseText);
            if (response.length === 0) {
                dropList();
                accountRegistration();
            } else {
                const $registerAccount = $accountForm.querySelector(':scope > .register-account-container');
                const $account = $registerAccount.querySelector(':scope > .account-info > .account');
                const $registerButton = $accountForm.querySelector(':scope > .dialog-main > .registrationbtn > .button');
                $registerAccount.show();
                $account.innerText = `${response[0]['bankName']} ${response[0]['accountNumber']} / ${response[0]['accountOwner']}`;
                $registerButton.innerText = '변경하기';
                $registerButton.style.pointerEvents = 'none';
                dropList();

                const $delete = $registerAccount.querySelector(':scope > .delete');
                $delete.onclick = (e) => {
                    e.preventDefault();

                    Dialog.defaultYesNo('판매 정산 계좌 삭제', '삭제하시겠습니까?', () => {
                        const xhr = new XMLHttpRequest();
                        const formData = new FormData();
                        formData.append('userId', $form['user-id'].value);
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState !== XMLHttpRequest.DONE) {
                                return;
                            }
                            if (xhr.status < 200 || xhr.status >= 300) {
                                return;
                            }
                            const response = JSON.parse(xhr.responseText);
                            if (response['result'] === 'failure') {
                                Dialog.defaultOk('판매 정산 계좌', '삭제에 실패하였습니다. 다시 시도해 주세요', ($dialog) => Dialog.hide($dialog));
                            } else if (response['result'] === 'success') {
                                $registerAccount.hide();
                                alert('계좌 삭제를 성공하였습니다.')
                                accountView();
                            } else {
                                Dialog.defaultOk('오류', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog));
                            }
                        };
                        xhr.open('DELETE', './my/account-delete');
                        xhr.send(formData);
                    });
                }
                $registerButton.innerText = '저장하기';
                $registerButton.style.pointerEvents = '';
                accountRegistration();
            }
        };
        xhr.open('GET', './my/account/');
        xhr.send();
    }
}
