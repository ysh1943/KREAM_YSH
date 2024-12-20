const $main = document.getElementById('main');

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
    const $similarImageCover = $main.querySelectorAll(':scope > .product-container > .left > .similar-image-container > .similar-image-cover');

    $similarImageCover.forEach(image => {
        const similarImageId = image.getAttribute('data-id');
        if (similarImageId === productId) {
            image.classList.add('---visible');
        }
    })
}
//endregion

const $buyButton = $main.querySelector(':scope > .product-container > .right > .button-container > .buy');

    $buyButton.onclick = () => {
        Dialog.defaultOk('구매하기', 'dsd', ($dialog) => Dialog.hide($dialog))
    }