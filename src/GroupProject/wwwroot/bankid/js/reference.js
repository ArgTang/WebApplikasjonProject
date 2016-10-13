setTimeout(function () {
    var birthnumber = $('#signature')

    var form = $('<form></form>');
    form.attr("method", "post");
    form.attr("action", "password.html");

    var field = $('<input></input>');
    field.attr("type", "hidden");
    field.attr("name", "birthnumber");
    field.attr("value", birthnumber.data('config').birthNumber);
    form.append(field);

    $(form).appendTo('body').submit();

},3000);