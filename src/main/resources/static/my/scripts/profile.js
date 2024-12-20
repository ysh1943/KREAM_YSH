const $snbArea = document.body.querySelector(':scope > .container > .content > .snb_area');
const $ContentArea = document.body.querySelector(':scope > .container >.content > .content_area');

const $Modify = $ContentArea.querySelector(':scope > .my_profile > .profile_info > .profile_group > .modify') // div 태그

$ContentArea.querySelector(':scope > .my_profile > .profile_info > .profile_group > .unit > .unit_content > button.password').onclick = (e) => {
    e.preventDefault();
    $Modify.show();
};

$Modify.querySelector(':scope > .modify_btn > .button.cancel').onclick = (e) => {
    e.preventDefault();
    $Modify.hide();
}

$Modify.onsubmit = (e) => {
    e.preventDefault();
    const $passwordLabel = $Modify.findLabel('password');
}






