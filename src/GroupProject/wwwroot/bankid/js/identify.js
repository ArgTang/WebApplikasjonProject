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
    submitButton.addEventListener("click", function () {
        if(validate(birthnumberInput.value)){
            doHideErrorMessage();
            post("bankid/identify", { birthnumber: birthnumberInput.value });
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
    addClass(infobubble, "show-error");
}

function doHideErrorMessage() {
    removeClass(infobubble,"show-error");
    addClass(infobubble, "hide-error");
}

function post(path, data) {
    var request = $.ajax({
        type: "POST",
        url: path,
        data: data
    });

    request.done(function (response) {
        if (response === "loggedIn") {
            window.location = "/loggedin";
        } else {
            $(".body").replaceWith(response);
        }
    });

    request.fail(function (
        jqXHR, textStatus) {
        $(".body").replaceWith(error);
    });
}

function error() {
    return `
        <main class ="body no-footer">
    <div class ="viewport animate">
        <div class ="scroller padding block_vertical_center full_width_height lm_view">
            <div>
                <div class ="content error">
                    <div class ="message">
                        <h2>Det har oppstått en feil.</h2>
                        <p>Vennligst prøv igjen senere.</p>
                    </div>
                    <div class ="call_to_action_wrapper">
                        <div class ="button_icon_wrapper">
                            <button class ="button" title="Neste" type="submit" onclick="location.href = '';">
                                <span class ="label" style="display: none;"></span>
                                <img alt="" class ="svg" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPmljb19hcnJvd19yaWdodDwvdGl0bGU+PHBhdGggZD0iTTE5IDExbC01IDUgMiAyIDgtOC41MzEtOC04LjQ2OS0yIDIgNSA1aC0xOXYzaDE5eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==">
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
        `;
}