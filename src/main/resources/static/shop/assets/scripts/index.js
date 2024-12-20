const $cover = document.getElementById('cover');
const $main = document.getElementById('main');
const $navForm = document.querySelector('.tab');
const $tabItems = Array.from($navForm.querySelectorAll('.tab > .button'));
const $sortList = document.querySelector('.sort-list');
const $sortItems = Array.from($sortList.querySelectorAll('.sort-item'));
const $sortButton = document.querySelector('.sort-title');

// 각 탭 버튼 클릭 시
$tabItems.forEach(($tabItem) => {
    $tabItem.addEventListener('click', (event) => {
        // 모든 버튼에서 '-selected' 클래스 제거
        $tabItems.forEach((x) => x.classList.remove('-selected'));

        // 클릭한 버튼에 '-selected' 클래스 추가
        $tabItem.classList.add('-selected');
    });
});

$sortItems.forEach(($sortItem) => {
    $sortItem.addEventListener('click', (event) => {
        $sortItems.forEach((x) => x.classList.remove('-selected'));

        $sortItem.classList.add('-selected');
    });
});

// 'sort-title' 버튼을 클릭할 때마다 'sort-list'의 visibility를 토글하는 코드
document.querySelector('.sort-title').addEventListener('click', function() {
    // '.sort-list' 요소를 찾아서 토글
    const sortList = document.querySelector('.sort-list');
    sortList.classList.toggle('-visible');
});

