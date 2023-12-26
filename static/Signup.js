const users = [];

const fin = document.querySelector("#fin");
const birthdate = document.querySelector("#birthdate");
const phone = document.querySelector("#phone");
const asan = document.querySelector("#asan");
const nextBtn = document.querySelector("#next");
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


nextBtn.addEventListener('click', () => {
    if(finDiv.style.display === "flex"){
    users.push({
        "fin": fin.value,
        "phone": phone.value
    })} else if(asanInfo.style.display === "flex"){
        users.push({
            "asan": asan.value,
            "phone": phone.value
        })  
    };
    localStorage.setItem("users", JSON.stringify(users));
    window.location.href = "http://127.0.0.1:5501/pages/OTP/OTP.html";

})