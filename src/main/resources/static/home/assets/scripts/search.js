const $header = document.getElementById('header');
const $main = document.getElementById('main');
const $cover = document.getElementById('cover');

{
    const $leave = $header.querySelector(':scope > .header-top > .leave');
    $leave.onclick = () => history.back();
}

{
    const $form = $header.querySelector(':scope > .form');
    const $search = $form.querySelector(':scope > .label > .search');
    const $cancel = $form.querySelector(':scope > .label > .cancel');
    const $result = $form.querySelector(':scope > .result');
    const $init = $form.querySelector(':scope > .result > .message > .init')
    const $loading = $form.querySelector(':scope > .result > .message > .loading');
    const $empty = $form.querySelector(':scope > .result > .message > .empty');
    const $error = $form.querySelector(':scope > .result > .message > .error');
    let searchTimeout;
    let searchLastKeyword;

    //region list button 검색시 /popular-keyword로 POST
    function createButton(keyword, name) {
        const $button = document.createElement('button');
        $button.classList.add('text');
        $button.type = 'submit';
        $button.innerText = name;
        $button.value = keyword

        $button.addEventListener('click', (e) => {
            e.preventDefault();

            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append("keyword", $button.value);
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
                if (xhr.status < 200 || xhr.status >= 300) {
                    Dialog.defaultOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog))
                    return;
                }
                const response = JSON.parse(xhr.responseText);
                if (response.result === 'success') {
                    location.href = `./shop?keyword=${$button.value}`;
                }
            };
            xhr.open('POST', '/popular-keyword');
            xhr.send(formData);
        });
        return $button;
    }

    //endregion

    //region input 시 /search-list로 GET
    $form['keyword'].addEventListener('input', () => {
        $form.querySelectorAll(':scope > .result > .item').forEach((x) => x.remove());
        $cancel.show();
        $search.show();
        $cover.style.display = 'block';
        $result.style.display = 'flex'
        $loading.style.display = 'none';
        $empty.style.display = 'none';
        if ($form['keyword'].value === '') {
            $init.style.display = 'flex';
            $loading.style.display = 'none';
        } else {
            $loading.style.display = 'block';
            $init.style.display = 'none';
            if (typeof searchTimeout === 'number') {
                clearTimeout(searchTimeout);
            }
            searchLastKeyword = $form['keyword'].value;
            searchTimeout = setTimeout(() => {
                if (searchLastKeyword !== $form['keyword'].value) {
                    return null;
                }
                const xhr = new XMLHttpRequest();
                const url = new URL(location.href);
                url.pathname = '/search-list';
                url.searchParams.set('keyword', $form['keyword'].value);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState !== XMLHttpRequest.DONE) {
                        return;
                    }
                    $loading.style.display = 'none';
                    if (xhr.status < 200 || xhr.status >= 300) {
                        $error.style.display = 'block';
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    if (response.length === 0) {
                        $empty.style.display = 'block';
                    } else {
                        const $result = $form.querySelector(':scope > .result');
                        const uniqueBrand = new Set();
                        for (const keyword of response) {
                            if (keyword['productNameKo'] == null && keyword['productNameEn'] == null && keyword['brand'] == null) {
                                continue;
                            }
                            if (keyword['brand'] != null && uniqueBrand.has(keyword['brand'])) {
                                continue;
                            }
                            const $item = document.createElement('span');
                            $item.classList.add('item');
                            if (keyword['brand'] != null) {
                                uniqueBrand.add(keyword['brand']);
                                $item.append(createButton(keyword['brand'], keyword['brand']));
                            }
                            if (keyword['productNameEn'] != null) {
                                $item.append(createButton(keyword['productNameEn'], keyword['productNameEn']));
                            }
                            if (keyword['productNameKo'] != null) {
                                $item.append(createButton(keyword['productNameKo'], keyword['productNameKo']));
                            }
                            $result.append($item);
                        }
                    }
                };
                xhr.open('GET', url.toString());
                xhr.send();
            }, 1000);
        }
    })
    $cancel.onclick = () => {
        $result.style.display = 'none';
        $loading.style.display = 'none';
        $empty.style.display = 'none';
        $error.style.display = 'none';
        $form['keyword'].value = '';
        $form['keyword'].focus();
        $cancel.hide();
        $search.hide();
        $cover.style.display = 'none';
    }
    //endregion
}


//region /recent-keyword GET
{
    const $recentArea = $main.querySelector(':scope > .recent-area')
    const $recentContentWrap = $main.querySelector(':scope > .recent-area > .recent-content-wrap');

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
        if (response.length > 0) {
            for (const keyword of response) {
                const $contentItem = document.createElement('div');
                $contentItem.classList.add('content-item');
                const $item = document.createElement('a');
                $item.classList.add('item');
                $item.href = `./shop?keyword=${keyword['keyword']}`;
                $item.innerText = `${keyword['keyword']}`;
                $contentItem.append($item);
                $recentContentWrap.append($contentItem);
            }
            $recentArea.style.display = 'flex';
        } else {
            $recentArea.style.display = 'none';
        }
    };
    xhr.open('GET', '/recent-keyword');
    xhr.send();
}
//endregion

//region /recent-keyword DELETE
{
    const $recentArea = $main.querySelector(':scope > .recent-area')
    const $recentCancel = $main.querySelector(':scope > .recent-area > .title-wrap > .recent-cancel');
    $recentCancel.onclick = () => {
        Dialog. defaultYesNo('최근 검색어 삭제', '검색기록을 모두 삭제하겠습니까?', () => {
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
                switch (response['result']) {
                    case 'failure_unsigned':
                        Dialog.defaultOk('계정 오류', '해당 계정은 이용이 정지된 상태이거나 이메일 인증이 완료되지 않았습니다. 관리자에게 문의해 주세요.', ($dialog) => Dialog.hide($dialog));
                        break;
                    case 'failure':
                        Dialog.defaultOk('최근 검색어 삭제', '최근 검색어가 없습니다. 새로고침 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog));
                        break;
                    case 'success':
                        $recentArea.style.display = 'none';
                        break;
                    default:
                        Dialog.defaultOk('오류', '서버가 알수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해주세요.', ($dialog) => Dialog.hide($dialog))
                        break;
                }
            };
            xhr.open('DELETE', '/recent-keyword');
            xhr.send();
        });
    };
}
//endregion

//region /recent-keyword POST
{
    const $form = $header.querySelector(':scope > .form');
    const $recentArea = $main.querySelector(':scope > .recent-area')
    $form.onsubmit = (e) => {
        e.preventDefault();

        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append("keyword", $form['keyword'].value);
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                Dialog.defaultOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog))
                return;
            }
            const response = JSON.parse(xhr.responseText);
            switch (response['result']) {
                case 'failure':
                    Dialog.defaultOk('계정 오류', '해당 계정은 이용이 정지된 상태입니다. 관리자에게 문의해 주세요.', ($dialog) => Dialog.hide($dialog));
                    break;
                case 'failure_unsigned':
                    location.href = `./shop?keyword=${$form['keyword'].value}`;
                    break;
                case 'success':
                    location.href = `./shop?keyword=${$form['keyword'].value}`;
                    break;
                default:
                    Dialog.defaultOk('오류', '서버가 알수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해주세요.', ($dialog) => Dialog.hide($dialog))
                    break;
            }
        }
        xhr.open('POST', '/recent-keyword');
        xhr.send(formData);
    }
}
//endregion

//region /popular-keyword GET
{
    const $popularArea = $main.querySelector(':scope > .popular-area');
    const $ul = $popularArea.querySelector(':scope > .popular-content-wrap > .ranking');
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
        if (response.length > 0) {
            for (let i = 0; i < response.length; i++) {
                const keyword = response[i];
                const $li = document.createElement('li');
                $li.classList.add('ranking-item');
                const $number = document.createElement('span');
                $number.classList.add('number');
                $number.innerText = (i + 1).toString();
                const $name = document.createElement('a');
                $name.classList.add('name');
                $name.href = `./shop?keyword=${keyword['keyword']}`;
                $name.innerText = `${keyword['keyword']}`;
                $li.append($number, $name);
                $ul.append($li);
            }
        }
    };
    xhr.open('GET', '/popular-keyword');
    xhr.send();
}
//endregion