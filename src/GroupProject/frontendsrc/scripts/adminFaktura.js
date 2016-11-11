function deleteInvoice() {
    var checkedCheckboxes = getCheckedBoxes();
    var request = $.ajax({
        type: "POST",
        url: "betal",
        data: {
            __RequestVerificationToken: $('#__AjaxAntiForgeryForm input[name=__RequestVerificationToken]').val(),
            checkBox: checkedCheckboxes
        }
    });

    request.done(function (response) {
        doResponse(JSON.parse(response));
    });

    request.fail(function (jqXHR, textStatus) {
        showError();
    });
}

function getCheckedBoxes() {
    var checkboxes = document.getElementsByName("isPayed");
    var checkboxesChecked = [];

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checkboxesChecked.push(checkboxes[i].value);
        }
    }
    return checkboxesChecked;
}

function doResponse(response) {
    if (response.error) showError();

    success(response.sucsessfullPayments);
    failed(response.falsePayments);
}

function failed(falsePays) {
    if (falsePays !== null && falsePays.length > 0) {
        falsePays.forEach(function (pay) {
            var tr = document.getElementById("invoiceId_" + pay.Id);
            tr.classList.add("bg-danger");
        });
    }
}

function success(successPays) {
    if (successPays !== null && successPays.length > 0) {
        showMessage();
        var trs = [];
        successPays.forEach(function (pay) {
            var tr = document.getElementById("invoiceId_" + pay.Id);
            tr.classList.add("bg-success");
            trs.push(tr);
        });
        setTimeout(function () {
            trs.forEach(function (tr) {
                tr.outerHTML = "";
            });
        }, 3000);
    }
}

function showError() {
    var p = document.createElement("p");
    var text = document.createTextNode("En eller flere betalinger feilet");
    var div = document.getElementById("errorMessage");
    p.classList.add("bg-danger");
    p.appendChild(text);

    div.appendChild(p);
    setTimeout(function () {
        div.removeChild(p);
    }, 3000);
}

function showMessage() {
    var p = document.createElement("p");
    var text = document.createTextNode("Betalingen var vellykket");
    var div = document.getElementById("errorMessage");
    p.classList.add("bg-success");
    p.appendChild(text);

    div.appendChild(p);

    div.appendChild(p);
    setTimeout(function () {
        div.removeChild(p);
    }, 3000);
}