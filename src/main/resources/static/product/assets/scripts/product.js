const $main = document.getElementById('main');
const $cover = document.querySelector('.cover');
const $dialog = document.querySelector('.dialog');

const user = "${user}";


//region image 슬라이드
{
    const $images = $main.querySelectorAll(':scope > .product-container > .left > .image-container > .image-cover');

    let slideIndex = 1;
    showSlides(slideIndex);

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function showSlides(n) {
        let i;
        if (n > $images.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = $images.length;
        }
        for (i = 0; i < $images.length; i++) {
            $images[i].style.display = "none"
        }
        $images[slideIndex - 1].style.display = "block";
    }
}
//endregion

//region similar-image ---visible 추가
{
    const url = new URL(location.href);
    const productId = url.searchParams.get('id');
    const $image = $main.querySelectorAll(':scope > .product-container > .left > .similar-image-container > .similar-image-cover > .link > .image');

    $image.forEach(image => {
        const similarImageId = image.getAttribute('data-id');
        if (similarImageId === productId) {
            image.classList.add('---visible');
        }
    })
}
//endregion

//region size-button
{
    const $size = $main.querySelector(':scope > .product-container > .right > .size');
    const $priceText = $main.querySelector(':scope > .product-container > .right > .price-container > .price-text');
    const $sizeText = $size.querySelector(':scope > .size-text');

    let isProcessing = false;
    $size.onclick = (e) => {
        e.preventDefault();

        if (isProcessing) return;
        isProcessing = true;

        $dialog.innerHTML = '';

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            isProcessing = false;
            if (xhr.status < 200 || xhr.status >= 300) {
                Dialog.defaultOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog))
                return;
            }
            const response = JSON.parse(xhr.responseText);

            if (response['result'] === 'logout') {
                location.href = './login';
            }

            const $titleContainer = new DOMParser().parseFromString(`
                <div class="title-container">
                    <button class="cancel">
                        <img class="icon" src="/assets/images/cancel-icon.png" alt="cancel">
                    </button>
                    <div class="title-wrap">
                        <span class="title">사이즈</span>
                    </div>
                </div>
                `, 'text/html').querySelector('.title-container');
            $dialog.append($titleContainer);

            // 취소버튼 클릭시 cover,dialog 숨김, scroll 생성
            const $cancel = $titleContainer.querySelector(':scope > .cancel');
            $cancel.onclick = () => {
                $cover.hide();
                $dialog.hide();
                document.body.classList.remove('no-scroll');
            }

            // 모든사이즈 button 추가
            const $SizeContainer = document.createElement('div');
            $SizeContainer.classList.add('size-container');
            const $sizeButton = document.createElement('button');
            $sizeButton.classList.add('size-button');
            const $size = document.createElement('span');
            $size.classList.add('size');
            $size.innerText = '모든 사이즈';
            const $price = document.createElement('span');
            $price.classList.add('price');
            $price.innerText = response[0]['lowestSellPrice'] === 0 ? '구매입찰' : response[0]['lowestSellPrice'].toLocaleString();
            $price.style.color = response[0]['lowestSellPrice'] === 0 ? '#22222280' : '#ef6253'
            $sizeButton.append($size, $price);
            $SizeContainer.append($sizeButton);

            $sizeButton.style.border = '0.0625rem solid #222222';
            $size.style.fontWeight = '700';
            $price.style.fontWeight = '700';
            if ($sizeText.innerText !== '모든사이즈') {
                $sizeButton.style.border = '';
                $size.style.fontWeight = '400';
                $price.style.fontWeight = '400';
            }

            // size별 버튼 추가
            for (const item of response) {
                const $sizeButton = document.createElement('button');
                $sizeButton.classList.add('size-button');
                const $size = document.createElement('span');
                $size.classList.add('size');
                $size.innerText = item['type'];
                const $price = document.createElement('span');
                $price.classList.add('price');
                $price.innerText = item['sellPrice'] === 0 ? '구매입찰' : item['sellPrice'].toLocaleString();
                $price.style.color = item['sellPrice'] === 0 ? '#22222280' : '#ef6253';
                $sizeButton.append($size, $price);
                $SizeContainer.append($sizeButton);

                $sizeButton.onclick = () => {
                    $sizeText.innerText = item['type'];
                    $priceText.innerText = item['sellPrice'] === 0 ? '-' : item['sellPrice'].toLocaleString() + '원';
                    const $buyPriceText = $main.querySelector(':scope > .product-container > .right > .button-container > .buy > .button-text-container > .buy-price-text');
                    const $sellPriceText = $main.querySelector(':scope > .product-container > .right > .button-container > .sell > .button-text-container > .sell-price-text');
                    $buyPriceText.innerText = item['sellPrice'] === 0 ? '-' : item['sellPrice'].toLocaleString() + '원';
                    $sellPriceText.innerText = item['buyPrice'] === 0 ? '-' : item['buyPrice'].toLocaleString() + '원';
                    $cover.hide();
                    $dialog.hide();
                    document.body.classList.remove('no-scroll');
                }

                if ($sizeText.innerText === item['type']) {
                    $sizeButton.style.border = '0.0625rem solid #222222';
                    $size.style.fontWeight = '700';
                    $price.style.fontWeight = '700';
                } else {
                    $sizeButton.style.border = '';
                    $size.style.fontWeight = '400';
                    $price.style.fontWeight = '400';
                }
            }

            $dialog.append($SizeContainer);
            $cover.show();
            $dialog.show();
            document.body.classList.add('no-scroll');

            $cover.onclick = () => {
                $cover.hide();
                $dialog.hide();
                document.body.classList.remove('no-scroll');
            }

            $sizeButton.onclick = () => {
                $sizeText.innerText = '모든사이즈';
                $priceText.innerText = response[0]['lowestSellPrice'] === 0 ? '-' : response[0]['lowestSellPrice'].toLocaleString() + '원';
                $cover.hide();
                $dialog.hide();
                document.body.classList.remove('no-scroll');
            }
        }
        xhr.open('GET', location.href);
        xhr.send();
    }
}
//endregion

//region order-button
{
    const $orderButton = $main.querySelectorAll(':scope > .product-container > .right > .button-container > .button');
    const $sizeText = $main.querySelector(':scope > .product-container > .right > .size > .size-text');

    let isProcessing = false;

    $orderButton.forEach(($orderButton) => {
        $orderButton.onclick = (e) => {
            e.preventDefault();

            if (user == null) {
                location.href = './login';
            }

            if (isProcessing) return;
            isProcessing = true;

            $dialog.innerHTML = '';

            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
                isProcessing = false;
                if (xhr.status < 200 || xhr.status >= 300) {
                    Dialog.defaultOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog))
                    return;
                }
                const response = JSON.parse(xhr.responseText);

                if (response['result'] === 'logout') {
                    location.href = './login';
                }

                // dialog 취소버튼과 title
                const $titleContainer = new DOMParser().parseFromString(`
                <div class="title-container">
                    <button class="cancel">
                        <img class="icon" src="/assets/images/cancel-icon.png" alt="cancel">
                    </button>
                    <div class="title-wrap">
                        <span class="title">${$orderButton.classList.contains('buy') ? '구매하기' : '판매하기'}</span>
                        <span class="sub-title">(가격 단위: 원)</span>
                    </div>
                </div>
                `, 'text/html').querySelector('.title-container');
                $dialog.append($titleContainer);

                // 취소버튼 클릭시 cover,dialog 숨김, scroll 생성
                const $cancel = $titleContainer.querySelector(':scope > .cancel');
                $cancel.onclick = () => {
                    $cover.hide();
                    $dialog.hide();
                    document.body.classList.remove('no-scroll');
                }

                // dialog 상품 이미지,이름,모델번호
                const $product = new DOMParser().parseFromString(`
                <div class="product">
                    <img class="image" src="${response[0]['base64Image']}" alt="image">
                    <div class="name-container">
                        <span class="name-en">${response[0]['nameEn']}</span>
                        <span class="name-ko">${response[0]['nameKo']}</span>
                        <span class="model-number">${response[0]['modelNumber']}</span>
                    </div>
                </div>
                `, 'text/html').querySelector('.product');
                $dialog.append($product);

                // dialog 사이즈별 버튼과 가격
                const $SizeContainer = document.createElement('div');
                $SizeContainer.classList.add('size-container');

                for (const item of response) {
                    const $sizeButton = new DOMParser().parseFromString(`
                    <button class="size-button">
                        <span class="size">${item['type']}</span>
                        <span class="price">${$orderButton.classList.contains('buy') ? (item['sellPrice'] === 0 ? '구매입찰' : item['sellPrice'].toLocaleString()) : (item['buyPrice'] === 0 ? '판매입찰' : item['buyPrice'].toLocaleString())}</span>
                    </button>
                    `, 'text/html').querySelector('.size-button');
                    $SizeContainer.append($sizeButton);

                    const $price = $sizeButton.querySelector(':scope > .price');

                    // 가격이 없을떄 color: #22222280
                    if ($price.innerText === '구매입찰' || $price.innerText === '판매입찰') {
                        $price.classList.add('empty');
                    }


                    // 사이즈버튼에서 선택한 사이즈와 일치한것을 order버튼에서 click상태로 대기
                    if ($sizeText.innerText === item['type']) {
                        $sizeButton.classList.add('focus');
                        setTimeout(() => {
                            $sizeButton.click();
                        }, 0);
                    }

                    // 사이즈별 버튼을 클릭했을떄
                    $sizeButton.onclick = () => {
                        const $resetOrder = $dialog.querySelector(':scope > .order');
                        const $resetBidContainer = $dialog.querySelector(' :scope > .bid-container');
                        if ($resetOrder) {
                            $resetOrder.remove();
                        }
                        if ($resetBidContainer) {
                            $resetBidContainer.remove();
                        }


                        // 즉시 구매,  장바구니 버튼
                        const $order = new DOMParser().parseFromString(`
                        <div class="order">
                            <div class="delivery">
                                <span class="text">일반배송</span>
                                <span class="date">5-7일</span>
                                <span class="-spring"></span>
                                <span class="delivery-price">${item['sellPrice'].toLocaleString() + '원'}</span>
                            </div>
                            <div class="button-container">
                                <button class="cart button" type="button">장바구니 담기</button>
                                <button class="buy button" type="button" data-id="buy">즉시 구매/ 구매 입찰</button>
                            </div>
                        </div>
                        `, 'text/html').querySelector('.order');
                        $dialog.append($order);

                        // //장바구니 담기
                        // const $userId = $dialog['user-id'].value;
                        const $cart = $order.querySelector(':scope > .button-container > .cart');
                        $cart.onclick = () => {
                            const xhr = new XMLHttpRequest();
                            const formData = new FormData();
                            formData.append('sellerBidId', item['sellerBidId']);
                            formData.append('userId',item['userId'])

                            xhr.onreadystatechange = () => {
                                if (xhr.readyState !== XMLHttpRequest.DONE) {
                                    return;
                                }
                                if (xhr.status < 200 || xhr.status >= 300) {
                                    Dialog.defaultOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog))
                                    return;
                                }
                                const response = JSON.parse(xhr.responseText);
                                console.log(response);
                                if (response['result'] === 'success') {
                                    location.href = '/cart/';
                                } else {
                                    Dialog.defaultOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog))
                                }

                            };
                            xhr.open('POST', '/cart/');
                            xhr.send(formData);
                        }

                        // 구매 입찰, 판매 입찰, 즉시 판매 버튼
                        const $bidContainer = new DOMParser().parseFromString(`
                        <div class="bid-container">
                            <button class="bid-button" type="button">${$orderButton.classList.contains('buy') ? '구매 입찰하기' : $price.innerText === '판매입찰' ? '판매 입찰하기' : '즉시 판매/ 판매 입찰'}</button>
                        </div>
                        `, 'text/html').querySelector('.bid-container');
                        $dialog.append($bidContainer);

                        const $bidButton = $bidContainer.querySelector(':scope > .bid-button');
                        const $buy = $order.querySelector(':scope > .button-container > .buy');


                        // 사이즈 버튼들에 border, font-weight 초기화
                        const $allSizeButtons = $SizeContainer.querySelectorAll(':scope > .size-button');
                        $allSizeButtons.forEach(button => {
                            button.classList.remove('focus');
                        })

                        // 사이즈 버튼에 border, font-weight 추가
                        $sizeButton.classList.add('focus');


                        // 즉시 판매, 판매 입찰은 background-color: #41b979
                        if ($bidButton.innerText !== '구매 입찰하기') {
                            $bidButton.classList.add('sell');
                        }


                        if ($orderButton.classList.contains('buy')) {
                            if ($price.innerText === '구매입찰') {
                                $bidContainer.style.display = 'block';
                                $bidButton.setAttribute('data-id', 'bid');
                                $bidButton.onclick = () => {
                                    const bidDataId = $bidButton.getAttribute('data-id');
                                    location.href = `./order?size-id=${item['sizeId']}&type=${bidDataId}`;
                                }
                            } else {
                                $order.style.display = 'flex';
                                $buy.onclick = () => {
                                    const buyDataId = $buy.getAttribute('data-id');
                                    location.href = `./order?size-id=${item['sizeId']}&type=${buyDataId}`;
                                }
                            }
                        } else {
                            if ($price.innerText === '판매입찰') {
                                $bidContainer.style.display = 'block';
                                $bidButton.setAttribute('data-id', 'add');
                                $bidButton.onclick = () => {
                                    const addDataId = $bidButton.getAttribute('data-id');
                                    location.href = `./order?size-id=${item['sizeId']}&type=${addDataId}`;
                                }
                            } else {
                                $bidContainer.style.display = 'block';
                                $bidButton.setAttribute('data-id', 'sell');
                                $bidButton.onclick = () => {
                                    const sellDataId = $bidButton.getAttribute('data-id');
                                    location.href = `./order?size-id=${item['sizeId']}&type=${sellDataId}`;
                                }
                            }
                        }
                    }
                }

                $dialog.append($SizeContainer);
                $cover.show();
                $dialog.show();
                document.body.classList.add('no-scroll');

                $cover.onclick = () => {
                    $cover.hide();
                    $dialog.hide();
                    document.body.classList.remove('no-scroll');
                }
            }
            xhr.open('GET', location.href);
            xhr.send();
        }
    })
}
//endregion

//region chart
{
    const $chartButton = $main.querySelectorAll(':scope > .product-container > .right > .detail-item-charts > .bids-container > .container-title > .button');
    const $table = $main.querySelector(':scope > .product-container > .right > .detail-item-charts > .bids-container > .table');
    const $tbody = $table.querySelector(':scope > .tbody');
    const $thead = $table.querySelector(':scope> .thead');

    const url = new URL(location.href);
    const productId = url.searchParams.get('id');

    $chartButton.forEach(($charButton) => {
        $charButton.onclick = () => {


            $chartButton.forEach(button => {
                button.style.backgroundColor = '';
            });


            $charButton.style.backgroundColor = '#ffffff';

            $tbody.innerHTML = '';

            let urlPath = '';
            let $tr = '';

            if ($charButton.dataset.id === 'order') {
                urlPath = './product-order-chart';
                $tr = new DOMParser().parseFromString(`
                <table>
                <thead>
                <tr class="tr">
                    <th class="th">옵션</th>
                    <th class="th -spring"></th>
                    <th class="th">거래가</th>
                    <th class="th">거래일</th>
                </tr>
                </thead>
                </table>`, 'text/html').querySelector('tr');
            } else if ($charButton.dataset.id === 'sell') {
                urlPath = './product-sell-chart';
                $tr = new DOMParser().parseFromString(`
                <table>
                <thead>
                <tr class="tr">
                    <th class="th">옵션</th>
                    <th class="th -spring"></th>
                    <th class="th">판매 희망가</th>
                    <th class="th">수량</th>
                </tr>
                </thead>
                </table>`, 'text/html').querySelector('tr');
            } else if ($charButton.dataset.id === 'buy') {
                urlPath = './product-buy-chart';
                $tr = new DOMParser().parseFromString(`
                <table>
                <thead>
                <tr class="tr">
                    <th class="th">옵션</th>
                    <th class="th -spring"></th>
                    <th class="th">구매 희망가</th>
                    <th class="th">수량</th>
                </tr>
                </thead>
                </table>`, 'text/html').querySelector('tr');
            }
            $thead.innerHTML = '';
            $thead.append($tr);

            if (urlPath) {
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
                    for (const item of response) {
                        const $tr = new DOMParser().parseFromString(`
                     <table>
                     <tbody>
                        <tr class="tr bid">
                            <td class="td">${item['sizeType']}</td>
                            <td class="td -spring"></td>
                            <td class="td">${item[$charButton.dataset.id === 'order' ? 'orderPrice' : $charButton.dataset.id === 'sell' ? 'sellPrice' : 'buyPrice'].toLocaleString() + '원'}</td>
                            <td class="td">${$charButton.dataset.id === 'order' ? item['orderDate'] : item[$charButton.dataset.id === 'sell' ? 'sellCount' : 'buyCount']}</td>
                        </tr>
                        </tbody>
                     </table>`, 'text/html').querySelector('tr');
                        $tbody.append($tr);
                    }
                };
                xhr.open('GET', `${urlPath}?id=${productId}`);
                xhr.send();
            }
        };
    });
}
//endregion















