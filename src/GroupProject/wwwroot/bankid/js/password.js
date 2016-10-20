var showPswWrapper = find(".show_psw_wrapper");
var showPasswordButton = find(".show_psw");
var passInput = find("#password");
var submitPassword = find("#submitPassword");

if (submitPassword) {
    submitPassword.addEventListener("click", function () {
        post("bankid/login", { password: passInput.value });
    });
}

if(passInput){
    passInput.addEventListener("change",function () {
       if(passInput.value === "") {
           showPassButton(false);
       }else{
           showPassButton(true);
       }
    });
}

if(showPswWrapper && passInput){

    passInput.addEventListener("keyup",function () {
        if(showPass){
            showPassButton(true);

        }else{
            showPassButton(false);
        }
    });
}

if(showPasswordButton){
    var showPass = true;
    showPasswordButton.addEventListener("click",function () {
        showPassword(showPass);
        showPass = !showPass;
    });
}

function showPassButton(show) {
    if(show) {
        showPswWrapper.classList.add("visible");
    }else{
        showPswWrapper.classList.remove("visible");
    }
}

function showPassword(show) {
    if(show === true) passInput.type= "text";
    else passInput.type = "password";
}
