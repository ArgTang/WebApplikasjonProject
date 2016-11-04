var menuButton = find("#menuButton");
var popoverWrapper = find(".popover_wrapper");
var cancelButton = find("#cancelButton");



var menuActive = false;
menuButton.addEventListener("click", function (event) {
    toggleMenu(!menuActive);
    menuActive = !menuActive;
});

cancelButton.addEventListener("click", function (event) {
    toggleMenu(false);
    window.location.reload();
});

function toggleMenu(show) {
    if (menuButton) {
        if (show) {
            popoverWrapper.classList.remove("hide");
        }
        else {
            popoverWrapper.classList.add("hide");
        }
    }
}
//# sourceMappingURL=header.js.map