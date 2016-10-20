

function reference() {

    //Simulate network delay
    setTimeout(function() {
            var request = $.ajax({
                type: "post",
                url: "bankid/auth"
            });

            request.done(function(response) {
                var newWindow = window.open("", "Mobile Auth", "height=500px,width=400px", false);
                newWindow.document.write(response);
                newWindow.birthNumber = window.birthNumber;
                newWindow.authToken = window.authToken;

                //if foreground window is blocked
                if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                    alert("Tillat forgrunnsvindu");
                } else {
                    var frequency = 3000; //every 2 seconds

                  var interval = window.setInterval(function() {
                            var checkRequest = $.ajax({
                                type: "post",
                                url: "bankid/auth/check",
                                data: { birthNumber: newWindow.birthNumber }
                            });

                            checkRequest.done(function(response) {
                                if (response === "authorized") {
                                    post("bankid/password", {});
                                    clearInterval(interval);
                                }else if (response === "error") {
                                    $(".body").replaceWith(error);
                                    clearInterval(interval);
                                }
                            });

                            checkRequest.fail(function(jqXHR, textStatus) {
                                $(".body").replaceWith(error);
                                clearInterval(interval);
                                console.log("error");
                            });
                        },
                        frequency);
                }


            });

            request.fail(function(jqXHR, textStatus) {
                $(".body").replaceWith(error);
            });


        },
        1700);

}