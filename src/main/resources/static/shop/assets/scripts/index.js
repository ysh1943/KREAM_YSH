const $sortList = document.querySelector('.sort-list');
const $sortItems = Array.from($sortList.querySelectorAll('.sort-item'));


document.querySelector('.sort-title').addEventListener('click', function() {
    // '.sort-list' 요소를 찾아서 토글
    const sortList = document.querySelector('.sort-list');
    sortList.classList.toggle('-visible');
});

$sortItems.forEach(($sortItem) => {
    $sortItem.addEventListener('click', () => {
        $sortItems.forEach((x) => x.classList.remove('-selected'));
        $sortItem.classList.add('-selected');

        const sortList = document.querySelector('.sort-list');
        sortList.classList.toggle('-visible');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const body = document.querySelector('body');
    const categoryButton = document.querySelectorAll('.category-button > button');
    const overlay = document.querySelector('.overlay');
    const categoryBox = document.querySelector('.category-box');
    const closeButton = document.querySelector('.filter-title .icon');

    // 카테고리 버튼을 클릭하면 필터 모달을 표시
    categoryButton.forEach(button => {
        button.addEventListener('click', function() {
            // 오버레이와 카테고리 박스에 show 클래스 추가
            body.classList.add('no-scroll');
            overlay.style.display = 'block';
            categoryBox.style.display = 'block';
        });
    });

    // 닫기 버튼 클릭 시 필터 모달을 닫음
    closeButton.addEventListener('click', function() {
        body.classList.remove('no-scroll');
        overlay.style.display = 'none';
        categoryBox.style.display = 'none';
    });

    // 오버레이를 클릭하면 모달 닫기
    overlay.addEventListener('click', function() {
        body.classList.remove('no-scroll');
        overlay.style.display = 'none';
        categoryBox.style.display = 'none';
    });
});



// 모든 체크박스 요소를 선택
const checkboxes = document.querySelectorAll('.check input[type="checkbox"]');

// 각 체크박스에 이벤트 리스너를 추가
checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function() {
        const checkBoxParent = this.closest('.check');  // 현재 체크박스의 부모 .check 요소 찾기

        if (this.checked) {
            // 체크박스가 체크된 경우
            checkBoxParent.style.backgroundColor = '#222';
            checkBoxParent.style.color = '#ffffff';
        } else {
            // 체크박스가 체크 해제된 경우
            checkBoxParent.style.backgroundColor = '#f4f4f4';
            checkBoxParent.style.color = '#222';
        }
    });
});

// 초기화 버튼 클릭 시 체크박스와 스타일을 초기화하는 로직
const resetButton = document.querySelector('.reset-button');
resetButton.addEventListener('click', function() {
    // 모든 체크박스의 체크 상태를 해제
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false; // 체크 상태 초기화
        const checkBoxParent = checkbox.closest('.check');
        checkBoxParent.style.backgroundColor = '#f4f4f4'; // 배경 색상 초기화
        checkBoxParent.style.color = '#222'; // 텍스트 색상 초기화
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // 초기 상태 설정: 인기순 목록을 보이게 하고 최신순 목록을 숨깁니다.
    const popularList = document.querySelector(".popular-list");
    const newList = document.querySelector(".new-list");
    const popularTitle = document.querySelector('.popular-title');
    const newTitle = document.querySelector('.new-title');

    // 기본적으로 인기순만 표시
    popularList.style.display = "grid";
    popularTitle.style.display = "inline-block";
    newList.style.display = "none";
    newTitle.style.display = "none";

    // 인기순 버튼 클릭 시
    const popularButton = document.querySelector(".popularButton");
    popularButton.addEventListener("click", function() {
        // 인기순 목록 보이기
        popularList.style.display = "grid";
        popularTitle.style.display = "inline-block";
        newList.style.display = "none";
        newTitle.style.display = "none";
    });

    // 발매일순 버튼 클릭 시
    const newButton = document.querySelector(".newButton");
    newButton.addEventListener("click", function() {
        // 발매일순 목록 보이기
        newList.style.display = "grid";
        newTitle.style.display = "inline-block";
        popularList.style.display = "none";
        popularTitle.style.display = "none";
    });
});
