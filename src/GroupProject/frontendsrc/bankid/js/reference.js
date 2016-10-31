function reference() {
    'use strict'
    // variable PostData comes from identify.js
    // Simulate network delay
    var delay = 1200;
    setTimeout( bankIdAjax, delay);

    function bankIdAjax() {
        var request = $.ajax({
                type: "post",
                url: "bankid/auth",
                data: postData
            });

        request.done(openWindow);

        request.fail(function(jqXHR, textStatus) {
            $(".body").replaceWith(error);
        });
    }

    function openWindow(response) {

        if (window.birthNumber === null) {
            $(".body").replaceWith(error);
            return;
        }

        var windowOptions = "height=500px, width=450px";
        var newWindow = window.open("", "Mobile Auth", windowOptions, false);
        newWindow.document.write(response);
        newWindow.birthNumber = window.birthNumber;
        newWindow.authToken = window.authToken;
        newWindow.reference = window.reference;
        newWindow.postData = postData;

        //if foreground window is blocked
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            alert("Du må tillate å åpne et forgrunnsvindu");
            return;
        } 

        var frequency = 3000; //every 2 seconds

        var interval = window.setInterval(function() {
            postData.birthnumber = newWindow.birthNumber;
            var checkRequest = $.ajax({
                type: "post",
                url: "bankid/auth/check",
                data: postData
            });

            checkRequest.done(function(response) {
                if (response === "authorized") {
                    post("bankid/password", {});
                } else if (response === "error") {
                    $(".body").replaceWith(error); 
                }
                clearInterval(interval);
            });

            checkRequest.fail(function(jqXHR, textStatus) {
                $(".body").replaceWith(error);
                clearInterval(interval);
            });
        },
        frequency);
    }
}