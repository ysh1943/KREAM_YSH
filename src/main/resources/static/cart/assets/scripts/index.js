const selectRemoveBtn = document.querySelector('.cart-header button[type=submit]');
const $cartContents = document.body.querySelectorAll(':scope > .cart-top-area > .cart-screen > .cart-content');

const Allcheck = document.querySelector('.cart-header input[type=checkbox]');
const $checkbox = document.querySelectorAll('.cart-content input[type=checkbox]');

Allcheck.addEventListener('change', function () {
    $checkbox.forEach((x) => {
        x.checked = Allcheck.checked;
    })
});

// 현재 모든 상품에 대해서 delete 요청을 건다
$cartContents.forEach($cartContent => {
    const $delete = $cartContent.querySelector('.text-header > .group > .button[type=submit]');
    $delete.onclick = (event) => {
        const cartId = $cartContent.querySelector('input[name=id]').value;
        delete_cart(event, cartId);
    };
});

// 선택된 모든 상품에 대해서 delete 요청을 보낸다
selectRemoveBtn.onclick = () => {
    for(let i = 0; i < $cartContents.length; i++){
        const checkbox = $cartContents[i].querySelector('input[type=checkbox]');
        if(checkbox.checked){
            const cartId = $cartContents[i].querySelector('input[name=id]').value;
            delete_cart(null, cartId);
        }
    }
}




function delete_cart(e, cartId) {
    if(e !== null){
        e.preventDefault();
    }
    const formData = new FormData();
    formData.append('id', cartId);


    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {

            return;
        }
        const response = JSON.parse(xhr.responseText);
        if (response['result'] === 'success') {
            location.reload();
        }else {
            Dialog.show({
                title: '삭제',
                content: '알 수 없는 이유로 삭제하지 못했습니다.',
                buttons: [{
                    text: '확인',
                    onclick: ($dialog) => Dialog.hide($dialog),
                }]
            });
        }
    };
    xhr.open('DELETE', './delete');
    xhr.send(formData);
}