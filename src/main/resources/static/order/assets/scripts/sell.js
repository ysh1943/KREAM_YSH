const $form = document.getElementById('form');
const $topTitle = $form.querySelector(':scope > .top > .top-title');
const $firstPage = $form.querySelector(':scope > .main > .order-container > .first-page');
const $nextPage = $form.querySelector(':scope > .main > .order-container > .next-page');
const $priceNow = $firstPage.querySelector(':scope > .price-wrap > .price-now');

const $inputPriceTitle = $priceNow.querySelector(':scope > .title-wrap > .price-now-title');
const $inputPrice = $priceNow.querySelector(':scope > .label > .input');
const $label = $priceNow.querySelector(':scope > .label');
const $price = $priceNow.querySelector(':scope > .price');
const $warning = $priceNow.querySelector(':scope > .title-wrap > ._warning');

const $addButton = $firstPage.querySelector(':scope > .price-wrap > .select-button > .add');
const $sellButton = $firstPage.querySelector(':scope > .price-wrap > .select-button > .sell');
const $deadlineWrap = $firstPage.querySelector(':scope > .deadline-wrap')

const $continueButton = $firstPage.querySelector(':scope > .button-wrap > .continue-button');

const $dateButton = $deadlineWrap.querySelectorAll(':scope  > .date-button-wrap > .date-button');
const $deadline = $deadlineWrap.querySelector(':scope  > .label > .deadline');
const $deadlineText = $deadlineWrap.querySelector(':scope  > .label > .deadline-date');

const $addressContainer = $nextPage.querySelector(':scope > .address-container');
const $lastOrderButtonWrap = $nextPage.querySelector(':scope > .order-button-wrap');
const $lastOrderButton = $nextPage.querySelector(':scope > .order-button-wrap > .order-button');

const $addressButtonText = $nextPage.querySelector(':scope > .address-container > .address-title-wrap > .address-button > .address-button-text');

const $firstCharge = $firstPage.querySelector(':scope > .price-wrap > .price-bind > .order-content-wrap > .content-text-wrap > .charge');
const $firstTotalPrice = $firstPage.querySelector(':scope > .button-wrap > .price-total > .price-total-text');

const url = new URL(location.href);
const type = url.searchParams.get('type');

const toggleButtons = (activeButton, otherButton) => {
    activeButton.classList.add('active');
    otherButton.classList.remove('active');
}

let isAddress = false;
let isAccount = false;


const updateLastButtonState = () => {
    if (isAddress && isAccount) {
        $lastOrderButton.classList.remove('disable-button');
        $lastOrderButtonWrap.classList.remove('disable-button');
    } else {
        $lastOrderButton.classList.add('disable-button');
        $lastOrderButtonWrap.classList.add('disable-button');
    }
};


//region input에 들어갈 금액 포맷팅
function formatPriceInput() {
    // 숫자만 입력할수 있고 천단위 콤마
    $inputPrice.addEventListener('input', () => {
        let numberPrice = Number($inputPrice.value.replace(/[^0-9]/g, ''));
        $inputPrice.value = numberPrice.toLocaleString();

        if (numberPrice >= 20000) {
            $warning.style.display = 'none';
            $inputPriceTitle.style.color = '#222222';
            $priceNow.style.borderBottom = '0.1625rem solid #222222';

        } else {
            $warning.style.display = 'block';
            $inputPriceTitle.style.color = '#ef6253';
            $priceNow.style.borderBottom = '0.0625rem solid #ef6253';
        }
    });
    $inputPrice.addEventListener('blur', () => {
        let value = $inputPrice.value.replace(/[^0-9]/g, '');
        value = Math.floor(value / 1000) * 1000;
        $inputPrice.value = value.toLocaleString();
        $inputPrice.placeholder = '희망가 입력';
        $priceNow.style.borderBottom = '0.0625rem solid #22222230';
        if (value >= 20000) {
            let chargeValue = 5000 + Math.floor(value * 0.04);
            $firstCharge.innerText = `-${chargeValue.toLocaleString()}원`;
            let totalValue = value - chargeValue;
            $firstTotalPrice.innerText = totalValue.toLocaleString() + '원';
            $continueButton.classList.remove('not-ready');
        } else {
            $continueButton.classList.add('not-ready');
        }
    });
    $inputPrice.addEventListener('focus', () => {
        $inputPrice.placeholder = '';
        $priceNow.style.borderBottom = '0.1625rem solid #222222';
        $continueButton.classList.add('not-ready');
    });
}

//endregion

//region 마감일 (현재 날짜에서 마감기간 더한 날짜)
function deadline(days) {
    const today = new Date();
    const deadlineDate = new Date(today);
    deadlineDate.setDate(today.getDate() + days);
    return `${deadlineDate.getFullYear()}-${String(deadlineDate.getMonth() + 1).padStart(2, '0')}-${String(deadlineDate.getDate()).padStart(2, '0')}`;
}

//endregion

//region 마감기간 버튼 클릭했을시 마감기간, 마감일 표시
function handleDeadlineButtons() {
    const defaultDays = 180;

    $dateButton.forEach(button => {
        const days = parseInt(button.getAttribute('data-days'), 10);

        if (days === defaultDays) {
            button.classList.add('focus');
            $deadline.innerText = `${defaultDays}일`;
            $deadlineText.value = `${deadline(defaultDays)}`
        }

        button.addEventListener('click', (x) => {
            $dateButton.forEach(x => x.classList.remove('focus'));
            $deadline.innerText = `${days}일`;
            $deadlineText.value = `${deadline(days)}`
            button.classList.add('focus');
        })
    })
}

//endregion

//region 다음페이지 내용 업데이트
function updateNextPage() {
    const $orderContainer = new DOMParser().parseFromString(`
    <div class="order-container">
                    <span class="title">최종 주문정보</span>
                    <div class="order-content-wrap">
                        <div class="content-title-wrap">
                            <span class="content-title bold">판매 희망가</span>
                            <span class="content-title">검수비</span>
                            <span class="content-title">수수료</span>
                            <span class="content-title">배송비</span>
                        </div>
                        <div class="-spring"></div>
                        <div class="content-text-wrap">
                            <span class="content-text bold">${$price.style.display === 'block' ? $price.innerText : $inputPrice.value + '원'}</span>
                            <span class="content-text">무료</span>
                            <span class="content-text charge">${$firstCharge.innerText}</span>
                            <span class="content-text">선불 • 판매자 부담</span>
                        </div>
                    </div>
                    <div class="deadline-wrap">
                        <span class="deadline-title">입찰 마감기한</span>
                        <span class="-spring"></span>
                        <span class="deadline-text">${$deadline.innerText + ' ' + $deadlineText.value + '까지'}</span>
                    </div>
                    <div class="all-price-wrap">
                        <span class="all-price-title">정산 금액</span>
                        <span class="all-price-text">${$firstTotalPrice.innerText}</span>
                    </div>
    </div>
    `, 'text/html').querySelector('.order-container');
    $nextPage.append($orderContainer)


    // const $orderButton = new DOMParser().parseFromString(`
    // <div class="order-button-wrap">
    //     <button class="order-button" type="submit">
    //         <span class="order-button-text">${$firstTotalPrice.innerText + ' • 입찰/판매하기'}</span>
    //     </button>
    // </div>
    // `, "text/html").querySelector('.order-button-wrap');
    // $nextPage.append($orderButton)

    const $orderButtonText = document.createElement('span');
    $orderButtonText.classList.add('order-button-text');
    $orderButtonText.innerText = $firstTotalPrice.innerText + '• 입찰하기';
    if ($price.style.display === 'block') {
        $orderButtonText.innerText = $firstTotalPrice.innerText + '• 결제하기';
    }
    $lastOrderButton.append($orderButtonText);

    $firstPage.style.display = 'none';
    $nextPage.style.display = 'flex';
}
//endregion

//region 주소 불러오기
{
    function getAddress() {

        // 주소 GET
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
            if (response['result'] === 'empty') {
                $addressButtonText.innerText = '새 주소 추가';
                const $addressContentWrap = new DOMParser().parseFromString(`
            <div class="address-content-wrap">
            <div class="empty-text">등록된 기본 배송지가 없습니다.</div>
            <div class="empty-text">새 주소지를 추가해주세요.</div>
                    </div>
        `, 'text/html').querySelector('.address-content-wrap');
                $addressContainer.append($addressContentWrap);
                isAddress = false;
                updateLastButtonState();
            } else {
                const $addressContentWrap = new DOMParser().parseFromString(`
            <div class="address-content-wrap">
                <input type="hidden" name="address-id" value="${response['id']}">
                <label class="label">
                    <span class="title">받는 분</span>
                    <input readonly maxlength="10" minlength="1" type="text" name="name" class="name" value="${response['name'] == null ? '-' : response['name']}">
                </label>
                <label class="label">
                    <span class="title">연락처</span>
                    <input readonly maxlength="11" minlength="10" type="tel" name="contact" class="contact" value="${response['contact'] == null ? '-' : response['contact']}">
                </label>
                <label class="label">
                    <span class="title">주소</span>
                    <input readonly maxlength=50 minlength="20" type="text" name="address" class="address" value="[${response['postal'] == null ? '-' : response['postal']}] ${response['basicAddress'] == null ? '' : response['basicAddress']} ${response['detailAddress'] == null ? '' : response['detailAddress']}">
                </label>
            </div>
        `, 'text/html').querySelector('.address-content-wrap');
                $addressContainer.append($addressContentWrap);
                isAddress = true;
                updateLastButtonState();

            }
        };
        xhr.open('GET', `/address?user-id=${$form['user-id'].value}`);
        xhr.send();
    }
}
//endregion

//region 주소 dialog
{
    const $layer = document.querySelector('.layer');
    const $cover = document.getElementById('cover');
    const $allCancel = $layer.querySelector(':scope > .layer_container > .close');
    const $addressForm = $layer.querySelector(':scope > .layer_container');
    const $title = $addressForm.querySelector(':scope > .layer_header > .title');
    const $addressList = $addressForm.querySelector(':scope > .address-list-container');
    const $layerContent = $addressForm.querySelector(':scope > .layer_content');
    const $cancel = $layerContent.querySelector(':scope > .layer_btn > .close');
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

                    isAddress = true;
                    updateLastButtonState();

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

//region 계좌 dialog
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

                isAccount = false;
                updateLastButtonState();
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

                isAccount = true;
                updateLastButtonState();
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
                                $lastOrderButton.classList.add('disable');
                                $lastOrderButtonWrap.classList.add('disable');
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
//endregion

//region getAccount
{
    function getAccount() {

        //계좌 GET
        const $accountContainer  = $nextPage.querySelector(':scope > .account-container');
        const $accountButtonText = $accountContainer.querySelector(':scope  > .account-title-wrap > .account-button > .account-button-text')
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
            if (response['result'] === 'empty') {
                const $accountContentWrap = new DOMParser().parseFromString(`
            <div class="account-content-wrap">
                <div class="empty-text">등록된 판매 정산 계좌가 없습니다.</div>
                <div class="empty-text">새 계좌번호를 추가해주세요.</div>    
            </div>
            `, "text/html").querySelector('.account-content-wrap');
                $accountContainer.append($accountContentWrap)
                $accountButtonText.innerText = '계좌추가';
                isAccount = false;
                updateLastButtonState();

            } else {
                const $accountContentWrap = new DOMParser().parseFromString(`
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
                $accountContainer.append($accountContentWrap);

                isAccount = true;
                updateLastButtonState();
            }

        };
        xhr.open('GET', `/account?user-id=${$form['user-id'].value}`);
        xhr.send();
    }
}
//endregion

//region 판매 입찰
function addFormSubmit() {
    $form.onsubmit = (e) => {
        e.preventDefault();

        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('price', $inputPrice.value.replace(/[^0-9]/g, ''));
        formData.append('deadline', $deadlineText.value);
        formData.append('addressId', $form['address-id'].value);
        formData.append('accountId', $form['account-id'].value);
        formData.append("userId", $form['user-id'].value);
        formData.append("sizeId", $form['size-id'].value);
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                Dialog.defaultOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog))
                return;
            }
            const response = JSON.parse(xhr.responseText);
            const [title, content, onclick] = {
                failure: ['판매 입찰', '알수 없는 이유로 구매 입찰에 실패하였습니다. 잠시 후 다시 시도해주세요.', ($dialog) => Dialog.hide($dialog)],
                failure_price: ['판매 입찰', '가격이 20,000원 이하이거나 백원, 십원, 일원 단위가 포함되어있습니다. 가격을 다시 한번 확인해주세요', ($dialog) => {
                    Dialog.hide($dialog);
                }],
                success: ['판매 입찰', '판매 입찰이 완료되었습니다..', ($dialog) => {
                    Dialog.hide($dialog);
                    location.href = './';
                }],
            }[response['result']] || ['오류', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog)];
            Dialog.show({
                title: title,
                content: content,
                buttons: [{text: '확인', onclick: onclick}]
            });
        };
        xhr.open('POST', '/sell-add');
        xhr.send(formData);
    }
}

//endregion

//region 즉시 판매
{
    function sellFormSubmit() {
        $form.onsubmit = (e) => {
            e.preventDefault();
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append("userId", $form['user-id'].value);
            formData.append('type', type);
            formData.append('buyerBidId', $form['buyer-bid-id'].value);
            formData.append('price', $firstTotalPrice.innerText.replace(/[^0-9]/g, ''));
            formData.append("addressId", $form['address-id'].value);
            formData.append('accountId', $form['account-id'].value);
            formData.append("sizeId", $form['size-id'].value);
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
                if (xhr.status < 200 || xhr.status >= 300) {
                    Dialog.defaultOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog))
                    return;
                }
                const response = JSON.parse(xhr.responseText);
                const [title, content, onclick] = {
                    failure: ['즉시 판매', '알수 없는 이유로 구매에 실패하였습니다. 잠시 후 다시 시도해주세요.', ($dialog) => Dialog.hide($dialog)],
                    failure_unsigned: ['즉시 판매', '로그인에 문제가 있습니다. 확인 후 다시 시도해 주세요.', ($dialog) => {
                        Dialog.hide($dialog);
                    }],
                    failure_price: ['즉시 판매', '구매자가 올린 가격과 일치하지 않습니다. 가격 확인 후 다시 시도해주세요.', ($dialog) => {
                        Dialog.hide($dialog);
                    }],
                    failure_address: ['즉시 판매', '반송 주소에 문제가 있습니다. 주소 확인 후 다시 시도해 주세요.', ($dialog) => {
                        Dialog.hide($dialog);
                    }],
                    failure_account: ['즉시 판매', '정산 계좌에 문제가 있습니다. 계좌 확인 후 다시 시도해 주세요.', ($dialog) => {
                        Dialog.hide($dialog);
                    }],
                    failure_buyerBid: ['즉시 판매', '구매자가 확인이 안됩니다. 잠시 후 다시 시도해 주세요.', ($dialog) => {
                        Dialog.hide($dialog);
                    }],
                    success: ['즉시 판매', '판매가 완료되었습니다. 진행상황은 판매내역에서 확인해 주세요.', ($dialog) => {
                        Dialog.hide($dialog);
                        location.href = './';
                    }],
                }[response['result']] || ['오류', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog)];
                Dialog.show({
                    title: title,
                    content: content,
                    buttons: [{text: '확인', onclick: onclick}]
                });
            };
            xhr.open('POST', '/sell-order');
            xhr.send(formData);
        }
    }
}
//endregion

if (type === 'add') {
    $topTitle.innerText = '판매 입찰하기';
    $inputPriceTitle.innerText = '판매 희망가'
    $addButton.classList.add('active');
    $sellButton.classList.add('disable');
    $deadlineWrap.style.display = 'flex';
    $continueButton.classList.add('not-ready');
    $inputPrice.value = '';

    formatPriceInput();
    handleDeadlineButtons();

    $continueButton.onclick = () => {
        getAccount();
        getAddress();
        updateNextPage();
        addFormSubmit();
    }
}

if (type === 'sell') {
    $topTitle.innerText = '즉시 판매하기';
    $sellButton.classList.add('active');
    $label.style.display = 'none';
    $price.style.display = 'block';
    $deadlineWrap.style.display = 'none';
    let value = Number($price.innerText.replace(/[^0-9]/g, ''));
    let chargeValue = 5000 + Math.floor(value * 0.04);
    $firstCharge.innerText = `-${chargeValue.toLocaleString()}원`;
    let totalValue = value - chargeValue;
    $firstTotalPrice.innerText = totalValue.toLocaleString() + '원';


    $continueButton.onclick = () => {
        getAccount();
        getAddress();
        updateNextPage();
        const $nextDeadlineWrap = $nextPage.querySelector(':scope > .order-container > .deadline-wrap');
        $nextDeadlineWrap.style.display = 'none';
        sellFormSubmit();
    }

    $addButton.onclick = () => {
        $topTitle.innerText = '판매 입찰하기';
        $inputPriceTitle.innerText = '판매 희망가'
        $deadlineWrap.style.display = 'flex';
        $continueButton.classList.add('not-ready');
        $label.style.display = 'flex';
        $price.style.display = 'none';
        $firstCharge.innerText = '-';
        $firstTotalPrice.innerText = '-';

        toggleButtons($addButton, $sellButton);
        formatPriceInput();
        handleDeadlineButtons();

        $continueButton.onclick = () => {
            getAccount();
            getAddress();
            updateNextPage();
            addFormSubmit();
        }
    }

    $sellButton.onclick = () => {
        $topTitle.innerText = '즉시 판매하기';
        $inputPriceTitle.innerText = '즉시 판매가'
        $inputPriceTitle.style.color = '#222222';
        $continueButton.classList.remove('not-ready');
        $deadlineWrap.style.display = 'none';
        $warning.style.display = 'none';
        $label.style.display = 'none';
        $price.style.display = 'block';
        let value = Number($price.innerText.replace(/[^0-9]/g, ''));
        let chargeValue = 5000 + Math.floor(value * 0.04);
        $firstCharge.innerText = `-${chargeValue.toLocaleString()}원`;
        let totalValue = value - chargeValue;
        $firstTotalPrice.innerText = totalValue.toLocaleString() + '원';

        toggleButtons($sellButton, $addButton);
        $continueButton.onclick = () => {
            getAccount();
            getAddress();
            updateNextPage();
            const $nextDeadlineWrap = $nextPage.querySelector(':scope > .order-container > .deadline-wrap');
            $nextDeadlineWrap.style.display = 'none';
            sellFormSubmit();
        }
    }
}