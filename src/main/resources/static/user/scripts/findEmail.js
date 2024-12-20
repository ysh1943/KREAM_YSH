{
    const $form = document.body.querySelector(':scope > .container > .content > .helf-area');
    $form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("contact", $form['contact'].value);

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                Dialog.show({
                    title: '오류',
                    content: '요청을 전송하는 도중 오류가 발생하였습니다 잠시 후 다시 시도해 주세요.',
                    buttons: [{
                        text: '확인',
                        onclick: ($dialog) => Dialog.hide($dialog),
                    }]
                });
                return;
            }
            const response = JSON.parse(xhr.responseText);
            // dom 요소..
            if (response['result'] === 'failure') {
                Dialog.show({
                    title: '이메일 찾기',
                    content: '입력하신 연락처와 일치하는 계정 정보를 찾을 수 없습니다',
                    buttons: [{
                        text: '확인',
                        onclick: ($dialog) => Dialog.hide($dialog),
                    }]
                });
            }
            if (response['result'] === 'success') {
                $form.innerHTML = ''
                const $div = new DOMParser().parseFromString(`
                        <div class="something">
                            <h2 class="helf-title">이메일 주소 찾기에 성공하였습니다.</h2>
                            <div class="helf_notice">
                                <di>
                                    <dt>이메일 주소</dt>
                                    <dd>${response['email']}</dd>
                                </di>
                            </div>
                            <div class="success_btn">
                                    <a class="password_find" href="/findpassword">비밀번호 찾기</a>
                                    <a class="loginPage" href="/login">로그인</a>
                            </div>    
                        </div>
                `,"text/html").querySelector('div');
                $form.append($div);
            }
        };
        xhr.open('POST', '/findEmail');
        xhr.send(formData);
    }


}