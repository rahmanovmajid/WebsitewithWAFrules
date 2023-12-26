const moreBtns = document.querySelectorAll("#more-btn");

moreBtns.forEach((moreBtn) => {
  moreBtn.addEventListener('click', () => {
    moreBtn.previousElementSibling.style.display = 'block';

    document.addEventListener('click', function (e) {
      const isClickInside = moreBtn.contains(e.target) || moreBtn.previousElementSibling.contains(e.target);
      if (!isClickInside) {
        moreBtn.previousElementSibling.style.display = 'none';
      }
    });
  })
})

const bannerBtn = document.querySelector("#banner-button");
const extraText = document.querySelector(".extra-text");

bannerBtn.addEventListener('click', () => {
  bannerBtn.previousElementSibling.style.display = 'block';

  document.addEventListener('click', function (e) {
    const isClickInside = bannerBtn.contains(e.target) || bannerBtn.previousElementSibling.contains(e.target);
    if (!isClickInside) {
      bannerBtn.previousElementSibling.style.display = 'none';
    }
  });
})

//currency api

const fromInfo = document.querySelector(".from-info");
const toInfo = document.querySelector(".to-info");
const fromSelect = document.querySelector('#from-select');
const toSelect = document.querySelector('#to-select');
const amountInput = document.getElementById('amount');
const resultDiv = document.getElementById('result');
const ratesDiv = document.querySelector(".rates");
const loginDiv = document.querySelector(".login-div");
const signInDiv = document.querySelector(".sign-in-div");
const hamburger = document.querySelector(".hamburger");
const username = document.querySelector(".username");
const logoutBtn = document.querySelector("#logout");
const signInBtn = document.querySelector("#sign-in-btn");
const servicesDiv = document.querySelector("#services-div");
const banksDiv = document.querySelector("#banks-div");

const getCurrencyAPI = () => {
  fetch('https://api.exchangerate.host/latest')
    .then(response => response.json())
    .then(data => {
      let header = `<h1>Cari Valyuta</h1>`;
      ratesDiv.innerHTML += header;
      for (let i = 0; i < Object.keys(data.rates).length; i++) {
        const AZN_rate = data.rates["AZN"];
        let key = Object.keys(data.rates)[i];
        if (key === "USD" || key === "EUR" || key === "RUB" || key === "TRY") {
          const AZN_rate = data.rates["AZN"];
          let countryRate = Object.values(data.rates)[i];
          let output = `<div class="country-rate">
                          <h1>${key}</h1>
                          <h1>${(AZN_rate / countryRate).toFixed(6)}</h1>
                        </div>
          `

          ratesDiv.innerHTML += output;
        }
      }
      Object.keys(data.rates).forEach(country => {
        const optionElementFrom = document.createElement('option');
        optionElementFrom.value = country;
        optionElementFrom.textContent = country;
        fromSelect.appendChild(optionElementFrom);
        const optionElementTo = document.createElement('option');
        optionElementTo.value = country;
        optionElementTo.textContent = country;
        toSelect.appendChild(optionElementTo);

      });
    })
    .catch(error => console.error(error));
}


getCurrencyAPI();

amountInput.addEventListener("input", () => {
  const toCurrency = toSelect.value;
  const fromCurrency = fromSelect.value;
  const amount = amountInput.value;

  fetch(`https://api.exchangerate.host/latest`)
    .then(response => response.json())
    .then(data => {
      const toRate = data.rates[toCurrency];
      const fromRate = data.rates[fromCurrency];
      resultDiv.value = amount * (toRate / fromRate);
    })
    .catch(error => console.error(error));
});



var LOGIN_SUCCESS = JSON.parse(localStorage.getItem("LOGIN_SUCCESS"));
if (LOGIN_SUCCESS === true) {
  loginDiv.style.display = "flex";
  signInDiv.style.display = "none";
  hamburger.style.display = "block";
  servicesDiv.style.display = "none";
  banksDiv.style.display = "flex";

} else if (LOGIN_SUCCESS === false) {
  loginDiv.style.display = "none";
  signInDiv.style.display = "block";
  hamburger.style.display = "none";
  servicesDiv.style.display = "flex";
  banksDiv.style.display = "none";
}




logoutBtn.addEventListener('click', () => {
  LOGIN_SUCCESS = false;
  localStorage.setItem("LOGIN_SUCCESS", JSON.stringify(LOGIN_SUCCESS));
  window.location.reload();
})

signInBtn.addEventListener('click', () => {
  window.location.href = "http://127.0.0.1:5000/login";
})

let btn = document.querySelector('.contact-link');
let aboutLink = document.querySelector('.about-link');
let servicesLink = document.querySelector('.services-link');
let footer = document.querySelector('#footer');
let services = document.querySelector('#services');
let about = document.querySelector('#info');






btn.addEventListener('click', function () {
    footer.scrollIntoView(true);
}); 

servicesLink.addEventListener('click', function () {
  services.scrollIntoView(true);
}); 

aboutLink.addEventListener('click', function () {
  about.scrollIntoView(true);
}); 


//Load Effect
$(function () {
  function count($this) {
    var current = parseInt($this.html(), 10);
    $this.html(++current);
    if (current == 17) {
      return;
    }
    if (current !== $this.data("count")) {
      setTimeout(function () {
        count($this);
      }, 8);
    }
  }
  $("#likes").each(function () {
    $(this).data("count", parseInt($(this).html(), 10));
    $(this).html("0");
    count($(this));
  });
});

$(function () {
  function count($this) {
    var current = parseInt($this.html(), 10);
    $this.html(++current);
    if (current == 200) {
      return;
    }
    if (current !== $this.data("count")) {
      setTimeout(function () {
        count($this);
      }, 10);
    }
  }
  $("#comments").each(function () {
    $(this).data("count", parseInt($(this).html(), 10));
    $(this).html("0");
    count($(this));
  });
});

$(function () {
  function count($this) {
    var current = parseInt($this.html(), 10);
    $this.html(++current);
    if (current == 4000) {
      return;
    }
    if (current !== $this.data("count")) {
      setTimeout(function () {
        count($this);
      }, 0.1); 
    }
  }
  $("#purchases").each(function () {
    $(this).data("count", parseInt($(this).html(), 10));
    $(this).html("0");
    count($(this));
  });
});


const A_bank = document.querySelector("#a-bank");
const B_bank = document.querySelector("#b-bank");
const C_bank = document.querySelector("#c-bank");

A_bank.addEventListener("click", () => {
  window.location.href = "http://127.0.0.1:5501/pages/BanksProducts/BanksProducts.html";
})

B_bank.addEventListener("click", () => {
  window.location.href = "http://127.0.0.1:5501/pages/BanksProducts/BanksProducts.html";
})

C_bank.addEventListener("click", () => {
  window.location.href = "http://127.0.0.1:5501/pages/BanksProducts/BanksProducts.html";
})
