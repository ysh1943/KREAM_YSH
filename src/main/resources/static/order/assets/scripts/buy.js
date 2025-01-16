const $form = document.getElementById('form');
const $topTitle = $form.querySelector(':scope > .top > .top-title');
const $firstPage = $form.querySelector(':scope > .main > .order-container > .first-page');
const $nextPage = $form.querySelector(':scope > .main > .order-container > .next-page');
const $priceNow = $firstPage.querySelector(':scope > .price-wrap > .price-now');

const $inputPriceTitle = $priceNow.querySelector(':scope > .title-wrap > .price-now-title');
const $inputPrice = $priceNow.querySelector(':scope > .label > .input');
const $label = $priceNow.querySelector(':scope > .label');
const $price = $priceNow.querySelector(':scope > .price');
const $warning = $firstPage.querySelector(':scope > .price-wrap > .price-now > .title-wrap > ._warning');

const $buyButton = $firstPage.querySelector(':scope > .price-wrap > .select-button > .buy');
const $bidButton = $firstPage.querySelector(':scope > .price-wrap > .select-button > .bid');
const $deadlineWrap = $firstPage.querySelector(':scope  >  .deadline-wrap');
const $continueButton = $firstPage.querySelector(':scope > .button-wrap > .continue-button');


const $dateButton = $deadlineWrap.querySelectorAll(':scope  > .date-button-wrap > .date-button');
const $deadline = $deadlineWrap.querySelector(':scope  > .label > .deadline');
const $deadlineText = $deadlineWrap.querySelector(':scope  > .label > .deadline-date');

const $addressContainer = $nextPage.querySelector(':scope > .address-container');
const $productContentWrap = $nextPage.querySelector(':scope > .order-product-container > .product-content-wrap');
const $contentTextWrap = $nextPage.querySelector(':scope > .order-container > .order-content-wrap > .content-text-wrap');
const $allPriceWrap = $nextPage.querySelector(':scope > .order-container > .all-price-wrap');
const $lastOrderButtonWrap = $nextPage.querySelector(':scope > .order-button-wrap');
const $lastOrderButton = $nextPage.querySelector(':scope > .order-button-wrap > .order-button');
const $nextPageDeadline = $nextPage.querySelector(':scope > .order-container > .deadline-wrap');

const $addressButtonText = $nextPage.querySelector(':scope > .address-container > .address-title-wrap > .address-button > .address-button-text');

const url = new URL(location.href);
const type = url.searchParams.get('type');

const toggleButtons = (activeButton, otherButton) => {
    activeButton.classList.add('active');
    otherButton.classList.remove('active');
}

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
    // 상품 구매입찰 금액
    const $nextPagePrice = document.createElement('span');
    $nextPagePrice.classList.add('next-page-price');
    $nextPagePrice.innerText = $inputPrice.value + '원';
    if ($price.style.display === 'block') {
        $nextPagePrice.innerText = $price.innerText;
    }
    $productContentWrap.append($nextPagePrice);

    // 주문정보에서 구매가
    const $orderPrice = document.createElement('span');
    $orderPrice.classList.add('content-text');
    $orderPrice.classList.add('bold');
    $orderPrice.innerText = $inputPrice.value + '원';
    if ($price.style.display === 'block') {
        $orderPrice.innerText = $price.innerText;
    }
    $contentTextWrap.prepend($orderPrice);

    // 최종 결제 금액
    const $lastPrice = document.createElement('span');
    $lastPrice.classList.add('all-price-text');
    let numberInputPrice = parseInt($inputPrice.value.replace(/[^0-9]/g, ''));
    numberInputPrice = numberInputPrice + 3000;
    let numberPrice = parseInt($price.innerText.replace(/[^0-9]/g, ''));
    numberPrice = numberPrice + 3000;
    numberInputPrice = numberInputPrice.toLocaleString();
    numberPrice = numberPrice.toLocaleString();
    $lastPrice.innerText = numberInputPrice + '원';
    if ($price.style.display === 'block') {
        $lastPrice.innerText = numberPrice + '원';
    }
    $allPriceWrap.append($lastPrice);

    // 입찰 버튼 내용
    const $orderButtonText = document.createElement('span');
    $orderButtonText.classList.add('order-button-text');
    $orderButtonText.innerText = numberInputPrice + '원 • 입찰하기';
    if ($price.style.display === 'block') {
        $orderButtonText.innerText = numberPrice + '원 • 결제하기';
    }
    $lastOrderButton.append($orderButtonText);

    // 마감기간, 마감일
    const $nextPageDeadlineText = document.createElement('span');
    $nextPageDeadlineText.classList.add('deadline-text');
    $nextPageDeadlineText.innerText = $deadline.innerText + ' ' + $deadlineText.value + '까지';
    $nextPageDeadline.append($nextPageDeadlineText);

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
            const $emptyAddressContentWrap = new DOMParser().parseFromString(`
            <div class="address-content-wrap">
            <div class="empty-text">등록된 기본 배송지가 없습니다.</div>
            <div class="empty-text">새 주소지를 추가해주세요.</div>
                    </div>
        `, 'text/html').querySelector('.address-content-wrap');
            $addressContainer.append($emptyAddressContentWrap);
            $lastOrderButton.classList.add('disable');
            $lastOrderButtonWrap.classList.add('disable');


        } else {
            const $addressContentWrap = new DOMParser().parseFromString(`
            <div class="address-content-wrap">
                <input type="hidden" name="address-id" value="${response['id']}">
                <label class="label">
                    <span class="title">받는 분</span>
                    <input maxlength="10" minlength="1" type="text" name="name" class="name" value="${response['name'] == null ? '-' : response['name']}">
                </label>
                <label class="label">
                    <span class="title">연락처</span>
                    <input maxlength="11" minlength="10" type="tel" name="contact" class="contact" value="${response['contact'] == null ? '-' : response['contact']}">
                </label>
                <label class="label">
                    <span class="title">주소</span>
                    <input maxlength=50 minlength="20" type="text" name="address" class="address" value="[${response['postal'] == null ? '-' : response['postal']}] ${response['basicAddress'] == null ? '' : response['basicAddress']} ${response['detailAddress'] == null ? '' : response['detailAddress']}">
                </label>
            </div>
        `, 'text/html').querySelector('.address-content-wrap');
            $addressContainer.append($addressContentWrap);
            $lastOrderButton.classList.remove('disable');
            $lastOrderButtonWrap.classList.remove('disable');
        }
    };
    xhr.open('GET', `/address`);
    xhr.send();


    $firstPage.style.display = 'none';
    $nextPage.style.display = 'flex';
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
                    $lastOrderButton.classList.remove('disable');
                    $lastOrderButtonWrap.classList.remove('disable');

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

//region 구매 입찰
function bidFormSubmit() {
    $form.onsubmit = (e) => {
        e.preventDefault();

        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('price', $inputPrice.value.replace(/[^0-9]/g, ''));
        formData.append('deadline', $deadlineText.value);
        formData.append('addressId', $form['address-id'].value);
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
                failure: ['구매 입찰', '알수 없는 이유로 구매 입찰에 실패하였습니다. 잠시 후 다시 시도해주세요.', ($dialog) => Dialog.hide($dialog)],
                failure_price: ['구매 입찰', '가격이 20,000원 이하이거나 백원, 십원, 일원 단위가 포함되어있습니다. 가격을 다시 한번 확인해주세요', ($dialog) => {
                    Dialog.hide($dialog);
                }],
                success: ['구매 입찰', '구매 입찰이 완료되었습니다. 입찰상황은 구매내역에서 확인해 주세요.', ($dialog) => {
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
        xhr.open('POST', '/buy-bid');
        xhr.send(formData);
    }
}

//endregion

//region 즉시 구매
function buyFormSubmit() {
    $form.onsubmit = (e) => {
        e.preventDefault();
        let IMP = window.IMP;
        IMP.init('imp67514014'); // 포트원 가맹점 코드

        const productName = $form['product-name'].value;
        const sizeId = $form['size-id'].value;
        const price = Number($price.innerText.replace(/[^0-9]/g, '')) + 3000;
        const email = $form['user-email'].value;
        const productId = $form['product-id'].value;

        IMP.request_pay({
            pg: "kakaopay.TC0ONETIME",
            merchant_uid: `${sizeId}-${new Date().getTime()}`,
            buyer_email: email,// 상점에서 생성한 고유 주문번호
            name: productName,
            amount: price,
        }, function (rsp) {
            if (rsp.success) {
                const xhr = new XMLHttpRequest();
                const formData = new FormData();
                formData.append("userId", $form['user-id'].value);
                formData.append('type', type);
                formData.append('sellerBidId', $form['seller-bid-id'].value);
                formData.append('price', price.toString());
                formData.append("addressId", $form['address-id'].value);
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
                    if (response['result'] === 'failure') {
                        Dialog.defaultOk('즉시 구매', '알수 없는 이유로 구매에 실패하였습니다. 잠시 후 다시 시도해주세요.', ($dialog) => Dialog.hide($dialog));
                    } else if (response['result'] === 'failure_unsigned') {
                        Dialog.defaultOk('즉시 구매', '로그인에 문제가 있습니다. 확인 후 다시 시도해 주세요.', ($dialog) => {
                            Dialog.hide($dialog);
                        })
                    } else if (response['result'] === 'failure_price') {
                        Dialog.defaultOk('즉시 구매', '판매자가 올린 가격과 일치하지 않습니다. 가격 확인 후 다시 시도해주세요.', ($dialog) => {
                            Dialog.hide($dialog);
                        })
                    } else if (response['result'] === 'failure_address') {
                        Dialog.defaultOk('즉시 구매', '배송 주소에 문제가 있습니다. 주소 확인 후 다시 시도해 주세요.', ($dialog) => {
                            Dialog.hide($dialog);
                        })
                    } else if (response['result'] === 'failure_sellerBid') {
                        Dialog.defaultOk('즉시 구매', '판매자가 확인이 안됩니다. 잠시 후 다시 시도해 주세요.', ($dialog) => {
                            Dialog.hide($dialog);
                        })
                    } else if (response['result'] === 'success') {
                        Dialog.defaultOk('즉시 구매', '구매가 완료되었습니다. 진행상황은 구매내역에서 확인해 주세요.', ($dialog) => Dialog.hide($dialog));
                        location.href = './';

                    } else {
                        Dialog.defaultOk('오류', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog));
                    }
                };
                xhr.open('POST', '/buy-order');
                xhr.send(formData);
            } else {
                alert("결제에 실패하였습니다: " + rsp.error_msg);
                location.href = `./product?id=${productId}`;
            }
        });
    }
}

//endregion

if (type === 'bid') {
    $topTitle.innerText = '구매 입찰하기';
    $inputPriceTitle.innerText = '구매 희망가'
    $bidButton.classList.add('active');
    $buyButton.classList.add('disable');
    $deadlineWrap.style.display = 'flex';
    $continueButton.classList.add('not-ready');

    formatPriceInput();
    handleDeadlineButtons();

    $continueButton.onclick = () => {
        updateNextPage();
        bidFormSubmit();
    }
}

if (type === 'buy') {
    $topTitle.innerText = '즉시 구매하기';
    $buyButton.classList.add('active');
    $label.style.display = 'none';
    $price.style.display = 'block';

    $continueButton.onclick = () => {
        $nextPageDeadline.style.display = 'none';
        updateNextPage();
        buyFormSubmit();
    }

    $bidButton.onclick = () => {
        $topTitle.innerText = '구매 입찰하기';
        $inputPriceTitle.innerText = '구매 희망가'
        $deadlineWrap.style.display = 'flex';
        $continueButton.classList.add('not-ready');
        $label.style.display = 'flex';
        $price.style.display = 'none';

        toggleButtons($bidButton, $buyButton);
        formatPriceInput();
        handleDeadlineButtons();

        $continueButton.onclick = () => {
            updateNextPage();
            bidFormSubmit();
        }
    }

    $buyButton.onclick = () => {
        $topTitle.innerText = '즉시 구매하기';
        $inputPriceTitle.innerText = '즉시 구매가'
        $inputPriceTitle.style.color = '#222222';
        $continueButton.classList.remove('not-ready');
        $deadlineWrap.style.display = 'none';
        $warning.style.display = 'none';
        $label.style.display = 'none';
        $price.style.display = 'block';

        toggleButtons($buyButton, $bidButton);

        $continueButton.onclick = () => {
            $nextPageDeadline.style.display = 'none';
            updateNextPage();
            buyFormSubmit();
        }
    }
}







