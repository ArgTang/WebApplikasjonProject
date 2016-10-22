const loginBtn = find("#loginBtn");
const bankidWrapper = find(".bankidWrapper");

function find(key) {
    return document.querySelector(key);
}

function toggleBankId() {
    bankidWrapper.classList.toggle("hide");
}

if (loginBtn) {
    loginBtn.addEventListener("click", function () {
        toggleBankId();
    });
}