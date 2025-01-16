const $nav = document.getElementById('nav');
const $navItems = Array.from($nav.querySelectorAll(':scope > .menu > .item[rel]'));
const $main = document.getElementById('main');
const $mainContents = Array.from($main.querySelectorAll(':scope > .content[rel]'));
const navActionMap = {
    'product-register': () => $mainContents.find((x) => x.getAttribute('rel') === 'product-register').querySelector(':scope > form').reset()
};

$navItems.forEach(($navItem) => {
    $navItem.onclick = () => {
        const rel = $navItem.getAttribute('rel');
        const action = navActionMap[rel];
        const $mainContent = $mainContents.find((x) => x.getAttribute('rel') === rel);
        if (typeof action === 'function') {
            action();
        }
        $navItems.forEach((x) => x.classList.remove('-selected'));
        $navItem.classList.add('-selected');
        $mainContents.forEach((x) => x.hide());
        $mainContent.show();
    };
});

//region 상품 목록
{
    const $content = $mainContents.find((x) => x.getAttribute('rel') === 'product-list');
    const $selectAllButton = $content.querySelector(':scope > .searchForm > [name="selectAll"]');
    const $unselectAllButton = $content.querySelector(':scope > .searchForm > [name="unselectAll"]');
    const $deleteButton = $content.querySelector(':scope > .searchForm > [name="delete"]');
    const $table = $content.querySelector(':scope > table');
    const $tbody = $table.querySelector(':scope > tbody');
    const $tr = $tbody.querySelector(':scope > tr');

    $selectAllButton.onclick = () => $tbody.querySelectorAll(':scope > tr > td > input[name="check"]').forEach((x) => x.checked = true);

    $unselectAllButton.onclick = () => $tbody.querySelectorAll(':scope > tr > td > input[name="check"]').forEach((x) => x.checked = false);

    const getCheckedTrs = () => Array.from($tbody.querySelectorAll(':scope > tr')).filter(($tr) => $tr.querySelector(':scope > td > input[name="check"]').checked);

    $deleteButton.onclick = () => {
        const $trs = getCheckedTrs();
        if ($trs.length === 0) {
            Dialog.defaultOk('선택 삭제', '삭제할 항목을 한 개 이상 선택해 주세요.');
            return;
        }
        if ($trs.some(($tr) => $tr.dataset['deleted'] === 'true')) {
            Dialog.defaultOk('선택 삭제', '이미 삭제된 항목이 선택되어 있습니다.<br><br>다시 한 번 확인해 주세요.');
            return;
        }
        Dialog.defaultYesNo('선택 삭제', `정말로 선택한 ${$trs.length.toLocaleString()}개의 상품을 삭제할까요?`, () => {
            const ids = $trs.map(($tr) => parseInt($tr.dataset['id']));
            sendDeleteRequest(ids);
        });
    };

    const rows = document.querySelectorAll('tr'); // 모든 tr 요소를 선택합니다.
    rows.forEach(($tr) => {
        const deleteButton = $tr.querySelector(':scope > td > button[name="delete"]');
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                Dialog.defaultYesNo('삭제', `정말로 선택한 상품을 삭제할까요?`, () =>
                    sendDeleteRequest($tr.dataset['id']));
            });
        }
    });

    const sendDeleteRequest = (ids) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        const idsArray = Array.isArray(ids) ? ids : [ids];

        idsArray.forEach((id) => formData.append('ids', id.toString()));
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            Loading.hide();
            if (xhr.status < 200 || xhr.status >= 300) {
                Dialog.show({
                    title: '오류',
                    content: '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.',
                    buttons: [{text: '확인', onclick: ($dialog) => Dialog.hide($dialog)}]
                });
                return;
            }
            const response = JSON.parse(xhr.responseText);
            switch (response['result']) {
                case 'failure':
                    Dialog.show({
                        title: '상품 삭제',
                        content: '알 수 없는 이유로 상품 삭제에 실패하였습니다. 잠시 후 다시 시도해 주세요.',
                        buttons: [{text: '확인', onclick: ($dialog) => Dialog.hide($dialog)}]
                    });
                    break;
                case 'success':
                    Dialog.show({
                        title: '상품 삭제',
                        content: '상품 삭제가 완료되었습니다.',
                        buttons: [{text: '확인', onclick: ($dialog) => {
                                Dialog.hide($dialog);
                                location.reload();
                            }}]
                    });
                    break;
                default:
                    alert('서버가 알 수 없는 응답을 반환하였습니다.');
                    break;
            }
        };
        xhr.open('DELETE', '/admin/product');
        xhr.send(formData);
        Loading.show(0);
    };
}
//endregion

//region 상품 등록
{
    const $content = $mainContents.find((x) => x.getAttribute('rel') === 'product-register');
    const $form = $content.querySelector(':scope > .form');
    const formData = new FormData();

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
                checkBoxParent.style.backgroundColor = '#ffffff';
                checkBoxParent.style.color = '#222';
            }
        });
    });

    const $previewWrapper = document.querySelectorAll('.preview-wrapper');
    $previewWrapper.forEach(($wrapper) => {
        const $inputFile = $wrapper.querySelector('input[type="file"]');
        const $text = $wrapper.querySelector('.text');
        const $image = $wrapper.querySelector('.image');

        // wrapper 클릭 시 input[type="file"] 클릭하도록 설정
        $wrapper.onclick = () => $inputFile.click();

        // 파일이 변경되었을 때 실행되는 이벤트 핸들러
        $inputFile.onchange = () => {
            if ($inputFile.files?.length === 0) {
                // 파일이 없으면 텍스트 표시하고 이미지 숨기기
                $text.style.display = 'flex';
                $image.style.display = 'none';
                $image.src = '';  // 미리보기 이미지 초기화
                return;
            }
            // 파일이 있으면 미리보기 이미지로 설정
            $text.style.display = 'none';
            $image.style.display = 'block';
            $image.src = URL.createObjectURL($inputFile.files[0]);

            // 파일을 formData에 추가
            formData.append('files', $inputFile.files[0]);
        };
    });

    $form.onsubmit = (e) => {
        e.preventDefault();
        formData.append('modelNumber', $form['modelNumber'].value);
        formData.append('baseName', $form['baseName'].value);
        formData.append('productNameKo', $form['productNameKo'].value);
        formData.append('productNameEn', $form['productNameEn'].value);
        formData.append('brand', $form['brand'].value);
        formData.append('releaseDate', $form['releaseDate'].value);
        formData.append('gender', $form['gender'].value);
        formData.append('category', $form['category'].value);
        if ($form['top'].value !== '') {
            formData.append('categoryDetail', $form['top'].value);
        } else if ($form['bottom'].value !== '') {
            formData.append('categoryDetail', $form['bottom'].value);
        } else if ($form['shoes'].value !== '') {
            formData.append('categoryDetail', $form['shoes'].value);
        } else {
            formData.append('categoryDetail', $form['accessories'].value);
        }
        formData.append('color', $form['color'].value);

        // 사이즈 배열 처리
        const selectedSizes = [];
        const sizeCheckboxes = $form.querySelectorAll("input[name='size']:checked");

        sizeCheckboxes.forEach((checkbox) => {
            selectedSizes.push(checkbox.value);
        });

        // 사이즈가 선택되었으면 배열 형태로 추가
        if (selectedSizes.length > 0) {
            selectedSizes.forEach((size) => {
                formData.append('sizes', size);  // 서버에서 sizes[] 배열로 받을 수 있게
                console.log(size);
            });
        }

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            Loading.hide();
            if (xhr.status < 200 || xhr.status >= 300) {
                Dialog.show({
                    title: '오류',
                    content: '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.',
                    buttons: [{text: '확인', onclick: ($dialog) => Dialog.hide($dialog)}]
                });
                return;
            }
            const response = JSON.parse(xhr.responseText);
            switch (response['result']) {
                case 'failure_unsigned':
                    Dialog.show({
                        title: '상품 등록',
                        content: '세션이 만요되었습니다. 로그인 후 다시 시도해 주세요.<br><br>확인 버튼을 클릭하면 로그인 페이지로 이동합니다.',
                        buttons: [{text: '확인', onclick: () => location.reload()}]
                    });
                    break;
                case 'failure':
                    Dialog.show({
                        title: '상품 등록',
                        content: '알 수 없는 이유로 상품 등록에 실패하였습니다. 잠시 후 다시 시도해 주세요.',
                        buttons: [{text: '확인', onclick: ($dialog) => Dialog.hide($dialog)}]
                    });
                    break;
                case 'success':
                    Dialog.show({
                        title: '상품 등록',
                        content: '상품 등록이 완료되었습니다.<br><br>확인 버튼을 클릭하면 상품 목록 페이지로 이동합니다.',
                        buttons: [{text: '확인', onclick: ($dialog) => {
                                Dialog.hide($dialog);
                                location.reload();
                            }}]
                    });
                    break;
                default:
                    alert('서버가 알 수 없는 응답을 반환하였습니다.');
                    break;
            }
        };
        xhr.open('POST', location.href);
        xhr.send(formData);
        Loading.show(0);
    };
}
//endregion