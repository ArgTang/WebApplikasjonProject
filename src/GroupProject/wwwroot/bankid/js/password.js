
function find( key ) {
    return document.querySelector(key);
}

function addClass( element, clas ) {
    var classes = element.className.split( " " );
    if ( classes.indexOf( clas ) === -1 ) {
        classes.push( clas );
        element.className = classes.join( " " );
    }
}

function removeClass( element, clas ) {
    var classes = element.className.split( " " );
    var indexOf = classes.indexOf( clas );

    if ( indexOf > -1 ) {
        classes.splice( indexOf, 1 );
        element.className = classes.join( " " );
    }
}

function hasClass( element, clas ) {
    var classes = element.className.split( " " );
    return classes.indexOf( clas ) > -1;
}

var showPswWrapper = find(".show_psw_wrapper");
var showPasswordButton = find(".show_psw");
var passInput = find("#password");

if(passInput){
    passInput.addEventListener("change",function () {
       if(passInput.value == "") {
           showPassButton(false)
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
    if(show == true){
        addClass(showPswWrapper, "visible");

    }else{
        removeClass(showPswWrapper, "visible");
    }
}

function showPassword(show) {
    if(show === true) passInput.type= "text";
    else passInput.type = "password";
}
