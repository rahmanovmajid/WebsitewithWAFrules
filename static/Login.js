const users = JSON.parse(localStorage.getItem("users"));

const fin = document.querySelector("#fin");
const password = document.querySelector("#password");
const signBtn = document.querySelector("#sign-in");
const finCode = document.querySelector("#fin-kod");
const asanImza = document.querySelector("#asan-imza");
const finDiv = document.querySelector(".info");
const asanInfo = document.querySelector(".asan-info");

finCode.addEventListener('click', () => {
    finCode.style.backgroundColor = "#540d68";
    finCode.style.border = "#540d68";
    asanImza.style.backgroundColor = "#DBB0E8";
    asanImza.style.border = "#DBB0E8";
    finDiv.style.display = "flex";
    asanInfo.style.display = "none";
})

asanImza.addEventListener('click', () => {
    asanImza.style.backgroundColor = "#540d68";
    asanImza.style.border = "#540d68";
    finCode.style.backgroundColor = "#DBB0E8";
    finCode.style.border = "#DBB0E8";
    finDiv.style.display = "none";
    asanInfo.style.display = "flex";
})

var LOGIN_SUCCESS = false;



