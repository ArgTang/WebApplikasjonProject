const loginBtn = find("#loginBtn");
const bankidWrapper = find(".bankidWrapper iframe");

function find(key) {
    return document.querySelector(key);
}

function toggleBankId() {
    bankidWrapper.classList.toggle("fadeOut");
}

if (loginBtn) {
    loginBtn.addEventListener("click", function () {
        toggleBankId();
    });
}