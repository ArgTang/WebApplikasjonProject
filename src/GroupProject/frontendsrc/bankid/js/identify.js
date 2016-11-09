function find(key) {
    return document.querySelector(key);
}

var postData = {}
postData.__RequestVerificationToken = $('#__AjaxAntiForgeryForm input[name=__RequestVerificationToken]').val();

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
            toggleErrorMessage(false);
            var sucsess = post("bankid/identify", { birthnumber: birthnumberInput.value });
            if (sucsess) {
                reference();
            }
        }else{
            toggleErrorMessage(true);
        }
    });
}


document.body.addEventListener("click",function () {
        toggleErrorMessage(false);
},true);

function toggleErrorMessage(bool) {
    if (infobubble) {
        if (bool) {
            infobubble.classList.remove("hide");
        } else {
            infobubble.classList.add("hide");
        }
    }

}

function post(path, data) {
    if(data.birthnumber)
        postData.birthnumber  = data.birthnumber;
    if (data.password)
        postData.password = data.password;
    if (data.authToken)
        postData.authToken = data.authToken;

    var result = true;
    var request = $.ajax({
        type: "POST",
        url: path,
        data: postData
    });

    request.done(function (response) {
        switch (response) {
            case "loggedIn":
                window.top.location = "/User";
                break;
            case "loggedInAdmin":
                window.top.location = "/Admin";
                break;
            default:
                $(".body").replaceWith(response);
                result = true;
        }
    });

    request.fail(function (
        jqXHR, textStatus) {
        $(".body").replaceWith(error);
        result= false;
    });
    return result;
}

function error() {
    return `
<main class="body no-footer">
    <div class="viewport animate">
        <div class="scroller padding block_vertical_center full_width_height lm_view">
            <div>
                <div class="content error">
                    <div class="message">
                        <h2>Det har oppstått en feil.</h2>
                        <p>Vennligst prøv igjen senere.</p>
                    </div>
                    <div class="call_to_action_wrapper">
                        <div class="button_icon_wrapper">
                            <button class="button" title="Neste" type="submit" onclick="location.href = '';">
                                <span class="label" style="display: none;"></span>
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