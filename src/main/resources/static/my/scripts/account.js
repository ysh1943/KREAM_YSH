const $form = document.body.querySelector(':scope > .container > .content >.content_area > .my_profile > .accountregistration');
const $registered = document.body.querySelector(':scope > .container > .content > .content_area > .my_profile > .registered');

const $ContentArea = document.body.querySelector(':scope > .container > .content > .content_area');
const $userId = document.getElementById('userId').value;


const accountLoad = () => {
    $ContentArea.innerHTML = '';
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            return;
        }
        const response = JSON.parse(xhr.responseText);
        if (response.length === 0) {
            const $MyProFile = new DOMParser().parseFromString(`
            <div class="my_profile">
                <div class="content_title">
                    <div class="title">
                        <h3>판매 정산 계좌</h3>
                    </div>
                </div>
                <form class="accountregistration">
                    <input name="userId" type="hidden" value="${$userId}">
                    <div class="input_box">
                        <h4 class="input_title">은행명</h4>
                        <label class="--obj-label" data-id="bankName">
                            <input autocomplete="off" class="input_txt" id="selectedBank" name="bankName" placeholder="선택하세요"
                                   readonly type="text">
                            <button class="btn" type="button">
                                <img alt="down-circle" class="image" height="24"
                                     src="/my/images/icons8-down-button-50.png" width="24">
                            </button>
                            <div class="layerDropdown">
                                <div class="layer-background"></div>
                                <div class="layer_container">
                                    <div class="layer_content">
                                        <ul class="drop_list">
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">국민은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">신한은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">우리은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">하나은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">기업은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">농협은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">SC은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">우체국</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">한국씨티은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">산업은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">카카오뱅크</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">부산은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">대구은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">광주은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">케이뱅크</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">수협중앙회</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">제주은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">전북은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">지역농축협</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">경남은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">새마을금고연합회</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">신협</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">저축은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">HSBC은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">도이치은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">제이피모간체이스은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">BOA은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">비엔피파리바은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">중국공상은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">산림조합</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">중국건설은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">토스뱅크</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <span class="_warning"></span>
                        </label>
                    </div>
                    <div class="input_box">
                        <h4 class="input_title">계좌번호</h4>
                        <label class="--obj-label" data-id="bankNumber">
                            <input class="input_txt" name="accountNumber" placeholder="-없이 입력하세요" type="text">
                            <span class="_warning"></span>
                        </label>
                    </div>
                    <div class="input_box">
                        <h4 class="input_title">예금주</h4>
                        <label class="--obj-label" data-id="name">
                            <input class="input_txt" name="accountOwner" placeholder="예금주명을 정확히 입력하세요" type="text">
                            <span class="_warning"></span>
                        </label>
                    </div>
                    <div class="registrationbtn">
                        <button class="button" type="submit">저장하기</button>
                    </div>
                </form>
            </div>`, "text/html").querySelector('.my_profile');
            const $form = $MyProFile.querySelector(':scope > form');
            $ContentArea.append($MyProFile);
            const $layerDropdown = $form.querySelector(':scope > .input_box > .--obj-label > .layerDropdown');
            const $button = $form.querySelector(':scope > .input_box > .--obj-label > .btn');
            const $dropLink = $layerDropdown.querySelectorAll(':scope > .layer_container > .layer_content > .drop_list > .drop_item > .drop_link');
            const $SelectBank = document.getElementById('selectedBank');
            let isDropdownVisible = false;
            const toggleDropdown = () => {
                if (isDropdownVisible) {
                    $layerDropdown.hide();
                    isDropdownVisible = false;
                } else {
                    $layerDropdown.show();
                    isDropdownVisible = true;
                }
            }
            $button.addEventListener('click', (e) => {
                e.preventDefault();
                toggleDropdown();
            });
            $dropLink.forEach((link) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    $SelectBank.value = link.textContent.trim();
                    $layerDropdown.hide(); // 드롭다운 숨김
                    isDropdownVisible = false; // 상태 업데이트
                });
            });
            $form.onsubmit = (e) => {
                e.preventDefault();
                const $bankNumberLabel = $form.findLabel('bankNumber');
                const $nameLabel = $form.findLabel('name');
                const $bankName = $form.findLabel('bankName');

                // $bankName.setValid($accountForm['bankName'].value.trim(), '은행명을 선택해주세요');
                $bankNumberLabel.setValid($form['accountNumber'].value.length > 6 && $form['accountNumber'].value.length < 16, '올바른 계좌번호를 입력해 주세요');
                $nameLabel.setValid($form['accountOwner'].value.length > 1 && $form['accountOwner'].value.length < 10, '올바른 이름을 입력해주세요');
                if (!$bankName.isValid() || !$nameLabel.isValid() || !$bankNumberLabel.isValid()) {
                    return;
                }
                const xhr = new XMLHttpRequest();
                const formData = new FormData();
                formData.append('userId', $form['userId'].value);
                formData.append('bankName', $form['bankName'].value);
                formData.append('accountNumber', $form['accountNumber'].value);
                formData.append('accountOwner', $form['accountOwner'].value);

                xhr.onreadystatechange = () => {
                    if (xhr.readyState !== XMLHttpRequest.DONE) {
                        return;
                    }
                    if (xhr.status < 200 || xhr.status >= 300) {
                        Dialog.show({
                            title: '판매정산 계좌',
                            content: '알 수 없는 이유로 계좌 등록에 실패하였습니다. 잠시 후 다시 시도해 주세요.',
                            buttons: [{
                                text: '확인',
                                onclick: ($dialog) => Dialog.hide($dialog),
                            }]
                        });
                        return;
                    }

                    const response = JSON.parse(xhr.responseText);
                    if (response['result'] === 'failure') {
                        Dialog.show({
                            title: '판매정산 계좌',
                            content: '등록된 계좌가 존재합니다. 삭제후 재등록 해 주시기 바랍니다.',
                            buttons: [{
                                text: '확인',
                                onclick: ($dialog) => Dialog.hide($dialog),
                            }]
                        });
                        return;
                    }
                    if (response['result'] === 'success') {
                        Dialog.show({
                            title: '판매정산 계좌',
                            content: '판매 정산 계좌를 등록하였습니다.',
                            buttons: [{
                                text: '확인',
                                onclick: ($dialog) => Dialog.hide($dialog),
                            }]
                        });
                        accountLoad();
                    }
                }
                xhr.open('POST', './account');
                xhr.send(formData);
            }
            return $MyProFile;
        } else {
            for (const responseElement of response) {
                const $MyProFile = new DOMParser().parseFromString(`
            <div class="my_profile">
                <div class="content_title">
                    <div class="title">
                        <h3>판매 정산 계좌</h3>
                    </div>
                </div>
                <div class="registered">
                    <div class="box">
                        <h4 class="box_title">등록된 계좌 정보</h4>
                        <div class="box_account_info">
                            <span class="account">${responseElement['bankName']}${responseElement['accountNumber']}</span>
                            <span class="account_devider">/</span>
                            <span class="name">${responseElement['accountOwner']}</span>
                        </div>
                    </div>
                    <button class="delete" type="button">삭제</button>
                </div>
                <form class="accountregistration">
                    <input name="userId" value="${$userId}" type="hidden">
                    <div class="input_box">
                        <h4 class="input_title">은행명</h4>
                        <label class="--obj-label" data-id="bankName">
                            <input autocomplete="off" class="input_txt" id="selectedBank" name="bankName" placeholder="선택하세요"
                                   readonly type="text">
                            <button class="btn" type="button">
                                <img alt="down-circle" class="image" height="24"
                                     src="/my/images/icons8-down-button-50.png" width="24">
                            </button>
                            <div class="layerDropdown">
                                <div class="layer-background"></div>
                                <div class="layer_container">
                                    <div class="layer_content">
                                        <ul class="drop_list">
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">국민은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">신한은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">우리은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">하나은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">기업은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">농협은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">SC은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">우체국</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">한국씨티은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">산업은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">카카오뱅크</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">부산은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">대구은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">광주은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">케이뱅크</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">수협중앙회</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">제주은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">전북은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">지역농축협</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">경남은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">새마을금고연합회</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">신협</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">저축은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">HSBC은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">도이치은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">제이피모간체이스은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">BOA은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">비엔피파리바은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">중국공상은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">산림조합</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">중국건설은행</a>
                                            </li>
                                            <li class="drop_item">
                                                <a class="drop_link" href="#">토스뱅크</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <span class="_warning"></span>
                        </label>
                    </div>
                    <div class="input_box">
                        <h4 class="input_title">계좌번호</h4>
                        <label class="--obj-label" data-id="bankNumber">
                            <input class="input_txt" name="accountNumber" placeholder="-없이 입력하세요" type="text">
                            <span class="_warning"></span>
                        </label>
                    </div>
                    <div class="input_box">
                        <h4 class="input_title">예금주</h4>
                        <label class="--obj-label" data-id="name">
                            <input class="input_txt" name="accountOwner" placeholder="예금주명을 정확히 입력하세요" type="text">
                            <span class="_warning"></span>
                        </label>
                    </div>
                    <div class="registrationbtn">
                        <button class="modifybtn" type="submit">변경하기</button>
                    </div>
                </form>
            </div>
            `, "text/html").querySelector('.my_profile');
                $ContentArea.append($MyProFile);
                const $form = $MyProFile.querySelector(':scope > form');
                const $layerDropdown = $form.querySelector(':scope > .input_box > .--obj-label > .layerDropdown');
                const $button = $form.querySelector(':scope > .input_box > .--obj-label > .btn');
                const $dropLink = $layerDropdown.querySelectorAll(':scope > .layer_container > .layer_content > .drop_list > .drop_item > .drop_link');

                const $SelectBank = document.getElementById('selectedBank');

                let isDropdownVisible = false;
                const toggleDropdown = () => {
                    if (isDropdownVisible) {
                        $layerDropdown.hide();
                        isDropdownVisible = false;
                    } else {
                        $layerDropdown.show();
                        isDropdownVisible = true;
                    }
                }
                $button.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleDropdown();
                });

                if ($dropLink.length > 0) {
                    $dropLink.forEach((link) => {
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            $SelectBank.value = link.textContent.trim();
                            $layerDropdown.hide(); // 드롭다운 숨김
                            isDropdownVisible = false; // 상태 업데이트
                        });
                    });
                }

                $form.onsubmit = (e) => {
                    e.preventDefault();
                    const $bankNumberLabel = $form.findLabel('bankNumber');
                    const $nameLabel = $form.findLabel('name');
                    const $bankName = $form.findLabel('bankName');

                    // $bankName.setValid($accountForm['bankName'].value.trim(), '은행명을 선택해주세요');
                    $bankNumberLabel.setValid($form['accountNumber'].value.length > 6 && $form['accountNumber'].value.length < 16, '올바른 계좌번호를 입력해 주세요');
                    $nameLabel.setValid($form['accountOwner'].value.length > 1 && $form['accountOwner'].value.length < 10, '올바른 이름을 입력해주세요');
                    if (!$bankName.isValid() || !$nameLabel.isValid() || !$bankNumberLabel.isValid()) {
                        return;
                    }
                    const xhr = new XMLHttpRequest();
                    const formData = new FormData();
                    formData.append('userId', $form['userId'].value);
                    formData.append('bankName', $form['bankName'].value);
                    formData.append('accountNumber', $form['accountNumber'].value);
                    formData.append('accountOwner', $form['accountOwner'].value);

                    xhr.onreadystatechange = () => {
                        if (xhr.readyState !== XMLHttpRequest.DONE) {
                            return;
                        }
                        if (xhr.status < 200 || xhr.status >= 300) {
                            Dialog.show({
                                title: '판매정산 계좌',
                                content: '알 수 없는 이유로 계좌 등록에 실패하였습니다. 잠시 후 다시 시도해 주세요.',
                                buttons: [{
                                    text: '확인',
                                    onclick: ($dialog) => Dialog.hide($dialog),
                                }]
                            });
                            return;
                        }

                        const response = JSON.parse(xhr.responseText);
                        if (response['result'] === 'failure') {
                            Dialog.show({
                                title: '판매정산 계좌',
                                content: '등록된 계좌가 존재합니다. 삭제후 재등록 해 주시기 바랍니다.',
                                buttons: [{
                                    text: '확인',
                                    onclick: ($dialog) => Dialog.hide($dialog),
                                }]
                            });
                            return;
                        }
                        if (response['result'] === 'success') {
                            Dialog.show({
                                title: '판매정산 계좌',
                                content: '판매 정산 계좌를 등록하였습니다.',
                                buttons: [{
                                    text: '확인',
                                    onclick: ($dialog) => Dialog.hide($dialog),
                                }]
                            });
                            accountLoad();
                        }
                    }
                    xhr.open('POST', './account');
                    xhr.send(formData);
                }
                $MyProFile.querySelector(':scope > .registered >.delete').onclick = (e) => {
                    e.preventDefault();
                    const xhr = new XMLHttpRequest();
                    const formData = new FormData();
                    formData.append('userId', $form['userId'].value);
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState !== XMLHttpRequest.DONE) {
                            return;
                        }
                        if (xhr.status < 200 || xhr.status >= 300) {
                            return;
                        }
                        const response = JSON.parse(xhr.responseText);
                        const [title, content, onclick] = {
                            failure: ['판매 정산 계좌', '삭제에 실패하였습니다. 다시 시도해 주세요', ($dialog) => Dialog.hide($dialog)],
                        }[response['result']] || ['오류', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.', ($dialog) => Dialog.hide($dialog)];
                        Dialog.show({
                            title: title, content: content, buttons: [{
                                text: '확인', onclick: onclick
                            }]
                        });
                        if (response['result'] === 'success') {
                            location.reload();
                        }
                    };
                    xhr.open('DELETE', './account-delete');
                    xhr.send(formData);
                }
                $form.querySelector(':scope > .registrationbtn > .modifybtn').onclick = (e) => {
                    e.preventDefault();
                    const formData = new FormData();
                    formData.append('userId', $form['userId'].value);
                    formData.append('bankName', $form['bankName'].value);
                    formData.append('accountNumber', $form['accountNumber'].value);
                    formData.append('accountOwner', $form['accountOwner'].value);

                    const xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState !== XMLHttpRequest.DONE) {
                            return;
                        }
                        if (xhr.status < 200 || xhr.status >= 300) {

                            return;
                        }
                        const response = JSON.parse(xhr.responseText);
                        if (response['result'] === 'failure') {
                            Dialog.show({
                                title: '판매 정산 계좌',
                                content: '등록된 계좌 정보와 일치합니다.',
                                buttons: [{
                                    text: '확인',
                                    onclick: ($dialog) => Dialog.hide($dialog),
                                }]
                            });
                        }
                        if (response['result'] === 'success') {
                            Dialog.show({
                                title: '판매 정산 계좌',
                                content: '계좌 정보를 수정하였습니다.',
                                buttons: [{
                                    text: '확인',
                                    onclick: ($dialog) => Dialog.hide($dialog),
                                }]
                            });
                            accountLoad();
                        }
                    };
                    xhr.open('PATCH', './account-modify');
                    xhr.send(formData);

                }

            }
        }
    };
    xhr.open('GET', `./account/`);
    xhr.send();
}
accountLoad();




