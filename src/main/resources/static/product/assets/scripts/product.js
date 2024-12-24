const $main = document.getElementById('main');
const $cover = document.querySelector('.cover');
const $dialog = document.querySelector('.dialog');

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

            // dialog header
            const $cancel = document.createElement('button');
            $cancel.classList.add('cancel');
            const $icon = document.createElement('img');
            $icon.classList.add('icon');
            $icon.src = "/assets/images/cancel-icon.png"
            $icon.alt = "cancel"

            const $titleContainer = document.createElement('div');
            $titleContainer.classList.add('title-container');
            const $title = document.createElement('span');
            $title.classList.add('title');
            $title.innerText = '사이즈';

            $cancel.append($icon);
            $titleContainer.append($title);
            $dialog.append($cancel);
            $dialog.append($titleContainer);

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

            $cancel.onclick = () => {
                $cover.hide();
                $dialog.hide();
                document.body.classList.remove('no-scroll');
            }
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
    let activeSizeButton = null;
    $orderButton.forEach(($orderButton) => {
        $orderButton.onclick = (e) => {
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
                const $cancel = document.createElement('button');
                $cancel.classList.add('cancel');
                const $icon = document.createElement('img');
                $icon.classList.add('icon');
                $icon.src = "/assets/images/cancel-icon.png"
                $icon.alt = "cancel"

                const $titleContainer = document.createElement('div');
                $titleContainer.classList.add('title-container');
                const $title = document.createElement('span');
                $title.classList.add('title');
                if ($orderButton.classList.contains('buy')) {
                    $title.innerText = '구매하기';
                } else if ($orderButton.classList.contains('sell')) {
                    $title.innerText = '판매하기';
                }
                const $subTitle = document.createElement('span');
                $subTitle.classList.add('sub-title');
                $subTitle.innerText = '(가격 단위: 원)';

                $cancel.append($icon);
                $titleContainer.append($title, $subTitle);
                $dialog.append($cancel);
                $dialog.append($titleContainer);

                const $product = document.createElement('div');
                $product.classList.add('product');
                const $image = document.createElement('img');
                $image.classList.add('image');
                $image.src = response[0]['base64Image'];
                $image.alt = 'image';
                const $nameContainer = document.createElement('div');
                $nameContainer.classList.add('name-container');
                const $nameEn = document.createElement('span');
                $nameEn.classList.add('name-en');
                $nameEn.innerText = response[0]['nameEn'];
                const $nameKo = document.createElement('span');
                $nameKo.classList.add('name-ko');
                $nameKo.innerText = response[0]['nameKo'];
                const $modelNumber = document.createElement('span');
                $modelNumber.classList.add('model-number');
                $modelNumber.innerText = response[0]['modelNumber'];

                $nameContainer.append($nameEn, $nameKo, $modelNumber);
                $product.append($image, $nameContainer);
                $dialog.append($product);

                const $SizeContainer = document.createElement('div');
                $SizeContainer.classList.add('size-container');

                for (const item of response) {
                    const $sizeButton = document.createElement('button');
                    $sizeButton.classList.add('size-button');
                    const $size = document.createElement('span');
                    $size.classList.add('size');
                    $size.innerText = item['type'];
                    const $price = document.createElement('span');
                    $price.classList.add('price');
                    if ($orderButton.classList.contains('buy')) {
                        $price.innerText = item['sellPrice'] === 0 ? '구매입찰' : item['sellPrice'].toLocaleString();
                        $price.style.color = item['sellPrice'] === 0 ? '#22222280' : '#ef6253';
                    } else if ($orderButton.classList.contains('sell')) {
                        $price.innerText = item['buyPrice'] === 0 ? '판매입찰' : item['buyPrice'].toLocaleString();
                        $price.style.color = item['buyPrice'] === 0 ? '#22222280' : '#ef6253';
                    }
                    $sizeButton.append($size, $price);
                    $SizeContainer.append($sizeButton);

                    if ($sizeText.innerText === item['type']) {
                        $sizeButton.style.border = "0.0625rem solid #222222";
                        $size.style.fontWeight = '700';
                        $price.style.fontWeight = '700';
                        activeSizeButton = $sizeButton;

                        setTimeout(() => {
                            $sizeButton.click();
                        }, 0);
                    }


                    $sizeButton.onclick = () => {
                        const $resetOrder = $dialog.querySelector('.order');
                        const $resetBuyBidContainer = $dialog.querySelector('.buy-bid-container');
                        if ($resetOrder) {
                            $resetOrder.remove();
                        }
                        if ($resetBuyBidContainer) {
                            $resetBuyBidContainer.remove();
                        }

                        if (activeSizeButton) {
                            activeSizeButton.style.border = "";
                            activeSizeButton.querySelector('.size').style.fontWeight = '400';
                            activeSizeButton.querySelector('.price').style.fontWeight = '400';
                        }

                        $sizeButton.style.border = "0.0625rem solid #222222";
                        $size.style.fontWeight = '700';
                        $price.style.fontWeight = '700';

                        activeSizeButton = $sizeButton;

                        const $order = document.createElement('div');
                        $order.classList.add('order');
                        $order.style.display = 'none'
                        const $delivery = document.createElement('div');
                        $delivery.classList.add('delivery');
                        const $text = document.createElement('span');
                        $text.classList.add('text');
                        $text.innerText = '일반배송';
                        const $date = document.createElement('span');
                        $date.classList.add('date');
                        $date.innerText = '5-7일';
                        const $spring = document.createElement('span');
                        $spring.classList.add('-spring');
                        const $deliveryPrice = document.createElement('span');
                        $deliveryPrice.classList.add('delivery-price');
                        $deliveryPrice.innerText = item['sellPrice'].toLocaleString() + '원';
                        const $buttonContainer = document.createElement('div');
                        $buttonContainer.classList.add('button-container');
                        const $cart = document.createElement('button');
                        $cart.classList.add('cart');
                        $cart.classList.add('button');
                        $cart.innerText = '장바구니 담기';
                        const $bid = document.createElement('button');
                        $bid.classList.add('bid');
                        $bid.classList.add('button');
                        $bid.innerText = '즉시 구매/ 구매 입찰';

                        $delivery.append($text, $date, $spring, $deliveryPrice);
                        $buttonContainer.append($cart, $bid);
                        $order.append($delivery, $buttonContainer);

                        const $buyBidContainer = document.createElement('div');
                        $buyBidContainer.classList.add('buy-bid-container');
                        $buyBidContainer.style.display = 'none'
                        const $buyBidButton = document.createElement('button');
                        $buyBidButton.classList.add('buy-bid-button');
                        if ($orderButton.classList.contains('buy')) {
                            $buyBidButton.innerText = '구매 입찰하기';
                            $buyBidButton.style.backgroundColor = '#ef6253'
                        } else if ($orderButton.classList.contains('sell')) {
                            $buyBidButton.innerText = '판매 입찰하기';
                            $buyBidButton.style.backgroundColor = '#41b979'
                        }
                        $buyBidContainer.append($buyBidButton);
                        $dialog.append($order, $buyBidContainer);


                        if ($orderButton.classList.contains('buy')) {
                            if ($price.innerText === '구매입찰') {
                                $buyBidContainer.style.display = 'block';
                            } else if ($price.innerText === item['sellPrice'].toLocaleString()) {
                                $order.style.display = 'flex';
                            }
                            $bid.onclick = () => {
                                location.href = './buy?id=';
                            }
                        }

                        if ($orderButton.classList.contains('sell')) {
                            if ($price.innerText === '판매입찰') {
                                $buyBidContainer.style.display = 'block';
                            } else if ($price.innerText === item['buyPrice'].toLocaleString()) {
                                $buyBidButton.innerText = '즉시 판매하기';
                                $buyBidContainer.style.display = 'block';
                            }
                            $bid.onclick = () => {
                                location.href = './buy?id=';
                            }
                        }
                    }
                }

                $dialog.append($SizeContainer);
                $cover.show();
                $dialog.show();
                document.body.classList.add('no-scroll');

                $cancel.onclick = () => {
                    $cover.hide();
                    $dialog.hide();
                    document.body.classList.remove('no-scroll');
                }
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
                $tr = new DOMParser().parseFromString( `
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
                $tr = new DOMParser().parseFromString( `
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
                $tr = new DOMParser().parseFromString( `
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
                        const $tr = new DOMParser().parseFromString( `
                     <table>
                     <tbody>
                        <tr class="tr bid">
                            <td class="td">${item['sizeType']}</td>
                            <td class="td -spring"></td>
                            <td class="td">${item[$charButton.dataset.id === 'order' ? 'orderPrice' : $charButton.dataset.id  === 'sell' ? 'sellPrice' : 'buyPrice'].toLocaleString() + '원'}</td>
                            <td class="td">${$charButton.dataset.id  === 'order' ? item['orderDate'] : item[$charButton.dataset.id  === 'sell' ? 'sellCount' : 'buyCount']}</td>
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















