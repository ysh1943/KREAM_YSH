const $tabLinks = document.querySelectorAll('.tab_link');
const $myOrderBoxes = document.body.querySelectorAll(':scope > .container > .content > .content_area > .my_Buying > .my_order_box');
const $layerButton = document.querySelector('.btn_filter');
const $layerTitle = $layerButton.querySelector(':scope > .title');
const $layers = document.querySelectorAll('.layer');
const $buyMenu = document.querySelector('.container > .content > .snb_area > .snb > .snb_list > .snb_menu > .menu_item > .requestPage');

$buyMenu.onclick = () => {
    const tab1 = Array.from($tabLinks).find(link => link.getAttribute('rel') === 'content1');
    if (tab1) {
        tab1.click();
    }
}

$tabLinks.forEach(link => {
    link.addEventListener('click', () => {
        $tabLinks.forEach(x => x.classList.remove('tab_on'));
        link.classList.add('tab_on');

        $myOrderBoxes.forEach(content => content.style.display = 'none');

        const target = document.getElementById(link.getAttribute('rel'));
        if (target) target.style.display = 'flex';

        $layers.forEach(layer => layer.style.display = 'none');


        $layerButton.addEventListener('click', () => {
            const layerId = link.getAttribute('rel');
            const $layer = document.getElementById(`${layerId}-layer`);
            if ($layer) $layer.style.display = 'block';

            const $close = $layer.querySelector(':scope > .layer_container > .layer_close');
            const $cover = $layer.querySelector(':scope > .layer_background');
            $close.onclick = () => $layer.style.display = 'none';
            $cover.onclick = () => $layer.style.display = 'none';
        })

        const defaultStates = {
            content1: "ALL",
            content2: "pending-all",
            content3: "finish-all",
        };

        const contentId = link.getAttribute('rel');
        const defaultState = defaultStates[contentId];
        const $content = document.getElementById(contentId);

        if ($content && defaultState) {
            const $defaultLink = $content.querySelector(`.status_link[data-id="${defaultState}"]`);
            if ($defaultLink) {
                $defaultLink.click(); // Simulate click on the default status link
            }
        }
    })
})


{
    const $content1 = document.getElementById('content1');
    const $layer = $content1.querySelector(':scope > .layer');
    $content1.onclick = () => {
    }
    $content1.querySelectorAll('.status_link').forEach(($statusLink) => {
        $statusLink.onclick = (e) => {
            e.preventDefault();
            $layer.style.display = 'none';
            let $text = $statusLink.querySelector(':scope > .text');
            $layerTitle.innerText = $text.innerText;
            const state = $statusLink.getAttribute('data-id')
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
                const $MyOrderList = $content1.querySelector(':scope > .my_order_list');
                $MyOrderList.innerHTML = '';

                if (response['result'] === 'logout') {
                    location.href = '../login';
                }

                if (response.length === 0) {
                    const $emptyPage = new DOMParser().parseFromString(`
                <div class="empty-page">
                                <div class="text_body">
                                    <span class="text">구매 입찰 내역이 없습니다.</span>
                                </div>
                                <a class="button" href="/shop">
                                    <div class="button_text">
                                        <div class="going-shop">SHOP 바로가기</div>
                                    </div>
                                </a>
                            </div>
                `, "text/html").querySelector('.empty-page');
                    $MyOrderList.append($emptyPage);
                }

                for (const item of response) {
                    const $productList = new DOMParser().parseFromString(`
                    <div class="my_order_list">
                            <a class="product_list" href="../product?id=${item['productId']}">
                                <div class="content">
                                    <div class="content_thumbnail-text">
                                        <div class="image">
                                            <img alt="image" src="${item['image']}" class="images">
                                        </div>
                                        <div class="layout_list">
                                            <div class="text">${item['baseName']}</div>
                                            <div class="size">${item['size']}</div>
                                        </div>
                                    </div>
                                    <span class="-spring"></span>
                                    <div class="text_body">${item['price'].toLocaleString() + '원'}</div>
                                    <div class="label_item">${item['state'] === 'BIDDING' ? item['deadline'] : '기한 만료'} </div>
                                    <div class="delete_button">
                                        <i class="icon fa-solid fa-trash-can"></i>
                                    </div>
                                </div>
                            </a>
                    </div>
                `, "text/html").querySelector('.product_list');
                    $MyOrderList.append($productList)

                    const $labelItem = $productList.querySelector(':scope > .content > .label_item');
                    if ($labelItem.innerText === '기한 만료') {
                        $labelItem.style.color = '#ef6253'
                    }

                    const $deleteButton = $productList.querySelector(':scope > .content > .delete_button');
                    $deleteButton.onclick = (e) => {
                        e.preventDefault();
                        Dialog.defaultYesNo('입찰 지우기', '등록하신 입찰을 지우시면 주문이 취소됩니다.', () => {

                            const xhr = new XMLHttpRequest();
                            const formData = new FormData();
                            formData.append('buyerBidId', item['buyerBidId'])
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
                                    failure: ['구매 입찰 삭제', '알수 없는 이유로 구매 입찰 삭제에 실패하였습니다. 잠시 후 다시 시도해주세요.', ($dialog) => Dialog.hide($dialog)],
                                    success: ['구매 입찰 삭제', '구매 입찰 삭제가 완료되었습니다..', ($dialog) => {
                                        Dialog.hide($dialog);
                                        location.reload();
                                    }],
                                }[response['result']] || ['오류', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog)];
                                Dialog.show({
                                    title: title,
                                    content: content,
                                    buttons: [{text: '확인', onclick: onclick}]
                                });
                            };
                            xhr.open('DELETE', './buying-bid');
                            xhr.send(formData);
                        })
                    }
                }


            };
            xhr.open('GET', `./buying-bid?state=${state}`);
            xhr.send();
        }
    });
}


{
    const $content2 = document.getElementById('content2');
    const $layer = $content2.querySelector(':scope > .layer');
    $content2.onclick = () => {
    }
    $content2.querySelectorAll('.status_link').forEach(($statusLink) => {
        $statusLink.onclick = (e) => {
            e.preventDefault();
            $layer.style.display = 'none';
            let $text = $statusLink.querySelector(':scope > .text');
            $layerTitle.innerText = $text.innerText;
            const state = $statusLink.getAttribute('data-id')
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
                const $MyOrderList = $content2.querySelector(':scope > .my_order_list');
                $MyOrderList.innerHTML = '';

                if (response['result'] === 'logout') {
                    location.href = '../login';
                }

                if (response.length === 0) {
                    const $emptyPage = new DOMParser().parseFromString(`
                <div class="empty-page">
                                <div class="text_body">
                                    <span class="text">거래 내역이 없습니다.</span>
                                </div>
                                <a class="button" href="/shop">
                                    <div class="button_text">
                                        <div class="going-shop">SHOP 바로가기</div>
                                    </div>
                                </a>
                            </div>
                `, "text/html").querySelector('.empty-page');
                    $MyOrderList.append($emptyPage);
                }

                for (const item of response) {
                    const $productList = new DOMParser().parseFromString(`
                    <div class="my_order_list">
                            <a class="product_list" href="../product?id=${item['productId']}">
                                <div class="content">
                                    <div class="content_thumbnail-text">
                                        <div class="image">
                                            <img alt="image" src="${item['image']}" class="images">
                                        </div>
                                        <div class="layout_list">
                                            <div class="text">${item['baseName']}</div>
                                            <div class="size">${item['size']}</div>
                                        </div>
                                    </div>
                                    <span class="-spring"></span>
                                    <div class="text_body">${item['price'].toLocaleString() + '원'}</div>
                                    <div class="label_item">${item['state']}</div>
                                </div>
                            </a>
                    </div>
                `, "text/html").querySelector('.product_list');
                    $MyOrderList.append($productList)

                    const $labelItem = $productList.querySelector(':scope > .content > .label_item');
                    if ($labelItem.innerText === '검수 불합격') {
                        $labelItem.style.color = '#ef6253'
                    }
                }
            };
            xhr.open('GET', `./buying-order?state=${state}`);
            xhr.send();
        }
    });
}

{
    const $content3 = document.getElementById('content3');
    const $layer = $content3.querySelector(':scope > .layer');
    $content3.onclick = () => {
    }
    $content3.querySelectorAll('.status_link').forEach(($statusLink) => {
        $statusLink.onclick = (e) => {
            e.preventDefault();
            $layer.style.display = 'none';
            let $text = $statusLink.querySelector(':scope > .text');
            $layerTitle.innerText = $text.innerText;
            const state = $statusLink.getAttribute('data-id')
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
                const $MyOrderList = $content3.querySelector(':scope > .my_order_list');
                $MyOrderList.innerHTML = '';

                if (response['result'] === 'logout') {
                    location.href = '../login';
                }

                if (response.length === 0) {
                    const $emptyPage = new DOMParser().parseFromString(`
                <div class="empty-page">
                                <div class="text_body">
                                    <span class="text">거래 내역이 없습니다.</span>
                                </div>
                                <a class="button" href="/shop">
                                    <div class="button_text">
                                        <div class="going-shop">SHOP 바로가기</div>
                                    </div>
                                </a>
                            </div>
                `, "text/html").querySelector('.empty-page');
                    $MyOrderList.append($emptyPage);
                }

                for (const item of response) {
                    const $productList = new DOMParser().parseFromString(`
                    <div class="my_order_list">
                            <a class="product_list" href="../product?id=${item['productId']}">
                                <div class="content">
                                    <div class="content_thumbnail-text">
                                        <div class="image">
                                            <img alt="image" src="${item['image']}" class="images">
                                        </div>
                                        <div class="layout_list">
                                            <div class="text">${item['baseName']}</div>
                                            <div class="size">${item['size']}</div>
                                        </div>
                                    </div>
                                    <span class="-spring"></span>
                                    <div class="text_body">${item['price'].toLocaleString() + '원'}</div>
                                    <div class="label_item">${item['state']}</div>
                                </div>
                            </a>
                    </div>
                `, "text/html").querySelector('.product_list');
                    $MyOrderList.append($productList)

                    const $labelItem = $productList.querySelector(':scope > .content > .label_item');
                    if ($labelItem.innerText === '취소완료') {
                        $labelItem.style.color = '#ef6253';
                    }
                }
            };
            xhr.open('GET', `./buying-order?state=${state}`);
            xhr.send();
        }
    });
}