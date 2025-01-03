const $myOrderBox = document.body.querySelector(':scope > .container > .content > .content_area > .my_Buying > .my_order_box');
const $myOrderBoxAll = document.body.querySelectorAll(':scope > .container > .content > .content_area > .my_Buying > .my_order_box');

const $layerButton = document.body.querySelector(':scope > .container > .content > .content_area > .my_Buying > .content_list > .bidding-header > .bidding > .purchase_head > .head_product > .btn_filter');

const $LinkArray = Array.from(document.body.querySelectorAll(':scope > .container > .content > .content_area > .my_Buying > .content_list > .bidding-header > .bidding > .purchase_list > .tab_item > .tab_link[rel]'));
const $layer = $myOrderBox.querySelector(':scope > .layer');
const $cover = $layer.querySelector(':scope > .layer_background');

console.log($myOrderBoxAll);

function showstate() {
    const urlparams = new URLSearchParams(window.location.search);
    if (urlparams.has('orderState')) {
        $myOrderBoxAll[1].classList.add('-visible');
    }
}

showstate();


$layerButton.onclick = (e) => {
    e.preventDefault();
    $cover.onclick = () => {
        $layer.hide();
    }
    $layer.show();
}

$myOrderBoxAll.forEach((box, index) => {
    if (index === 0) {
        box.classList.add('-visible');
    } else {
        box.classList.remove('-visible');
    }
});


// 모든 링크에 클릭 이벤트 핸들러 추가
$LinkArray.forEach($link => {
    $link.addEventListener('click', (event) => {
        event.preventDefault(); // 기본 동작(페이지 이동) 방지


        // 현재 클릭한 링크의 rel 속성 값 가져오기
        const relValue = $link.getAttribute('rel');

        $myOrderBoxAll.forEach((box) => {
            box.classList.remove('-visible');
        });


        // rel 값과 일치하는 div 찾아서 표시
        const $targetDiv = document.getElementById(relValue);

        if ($targetDiv) {
            $targetDiv.classList.add('-visible');
            $layerButton.onclick = () => {
                $targetDiv.querySelector(':scope > .layer > .layer_background').onclick = () => {
                    $targetDiv.querySelector(':scope > .layer').hide();
                }
                $targetDiv.querySelector(':scope > .layer').show();
            }
        }
    });
});

{
    const $content2 = document.getElementById('content2');
    $content2.querySelectorAll('.status_link').forEach(($statusLink) => {
        $statusLink.onclick = (e) => {
            e.preventDefault();
            const orderState = $statusLink.getAttribute('data-id')

            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
                if (xhr.status < 200 || xhr.status >= 300) {

                    return;
                }
                const response = JSON.parse(xhr.responseText);
                const $Myorderlist = $content2.querySelector(':scope > .my_order_list');
                $Myorderlist.innerHTML = '';

                for (const res of response) {
                    const $layerorderlist = new DOMParser().parseFromString(`
                    <div class="my_order_list">
                            <div class="divider"></div>
                            <a class="product_list" href="#">
                                <div class="content">
                                    <div class="content_thumbnail-text">
                                        <div class="image">
                                            <img alt="${response['image']}" class="images">
                                        </div>
                                        <div class="layout_list">
                                            <div class="text">${response['baseName']}</div>
                                            <div class="size">${response['size']}</div>
                                        </div>
                                    </div>
                                    <div class="text_body">${response['price']}</div>
                                    <div class="label_item">${response['deadline']}</div>
                                </div>
                            </a>
                    </div>                                        
                `, "text/html").querySelector('.my_order_list');
                    $Myorderlist.append($layerorderlist)
                }
            };
            xhr.open('GET', `./buying/?state=${orderState}`);
            xhr.send();

            $content2.querySelector(':scope > .layer').hide();
        }
    });
}