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

function validate(birthNumber) {

    birthNumber = birthNumber.toString();
    if(!birthNumber || birthNumber.length !== 11){
        return false;
    }

    var _sum = function(birthNumber, factors){
        var sum = 0;
        for(i = 0, l = factors.length; i < l; ++i){
            sum += parseInt(birthNumber.charAt(i),10) * factors[i];
        }
        return sum;
    };

    var checksum1 = 11 - (_sum(birthNumber, [3, 7, 6, 1, 8, 9, 4, 5, 2]) % 11);
    if (checksum1 === 11) checksum1 = 0;
    var checksum2 = 11 - (_sum(birthNumber, [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]) % 11);
    if (checksum2 === 11) checksum2 = 0;
    return checksum1 === parseInt(birthNumber.charAt(9), 10)
        && checksum2 === parseInt(birthNumber.charAt(10), 10);

}



var birthnumberInput = find( "#birthnumberInput" );
var submitButton = find("#submitButton");
var infobubble = find(".infobubble_wrapper");

if(submitButton && birthnumberInput){
    submitButton.addEventListener("click",function () {
        if(validate(birthnumberInput.value)){
            doHideErrorMessage();
            post("reference",{birthnumber:birthnumberInput.value})
        }else{
            doShowErrorMessage();
        }
    });
}


document.body.addEventListener("click",function () {
    if(hasClass(infobubble,"show-error")){
        doHideErrorMessage();
    }
},true);

function doShowErrorMessage() {
    removeClass(infobubble,"hide-error");
    addClass(infobubble,"show-error")
}

function doHideErrorMessage() {
    removeClass(infobubble,"show-error");
    addClass(infobubble,"hide-error")
}

function post(path, data) {

    $.ajax({
        type: "POST",
        url: path,
        data: data,
        success: function (response) {
            $("#loader").innerHtml = response
        }
    });
}