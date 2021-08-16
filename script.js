const api = {
  key: "25396e0a83bbff5df47bd97faee582aa",
  base: "https://api.openweathermap.org/data/2.5/",
  lang: "pt_br",
  units: "metric",

}

//header
let msg = document.querySelector('.msg')
const search_input = document.querySelector('.form-control');
const search_button = document.querySelector('.btn');
//top
const city = document.querySelector('.city');
let digital = document.querySelector('.digital');
const date = document.querySelector('.date');
const img = document.querySelector('.icon');
const weather_t = document.querySelector('.weather');
//middle
const container_temp = document.querySelector('.temp');
const temp_number = document.querySelector('.temp-number');
const temp_unit = document.querySelector('.temp-unit');
const low_high = document.querySelector('.low-high');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
//bottom


function updateClock() {
  let now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();

  digital.innerHTML = `${fixZero(hour)}:${fixZero(minute)}:${fixZero(second)}`;

  if (hour >= 6 && hour < 12) {
    msg.innerHTML = "Bom dia!"
  }
  else if (hour >= 12 && hour < 18) {
    msg.innerHTML = "Boa tarde!"
  }
  else {
    msg.innerHTML = "Boa noite!"
  }

}

function fixZero(time) {
  return time < 10 ? `0${time}` : time;
}

setInterval(updateClock, 1000);
updateClock();


window.addEventListener('load', () => {
  //if ("geolocation" in navigator)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
  }
  else {
    alert('navegador não suporta geolocalização');
  }
  function setPosition(position) {
    console.log(position)
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    coordResults(lat, long);
  }
  function showError(error) {
    alert(`erro: ${error.message}`);
  }
})

function coordResults(lat, long) {
  fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
    .then(resolucao => resolucao.json())
    .then((body) => displayResults(body))
    .catch(error => alert(error.message))
}

//busca cidade 
search_button.addEventListener('click', function () {
  searchResults(search_input.value)
  clear();
})

function searchResults(city) {
  fetch(`${api.base}weather?q=${city}&cnt=2&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
    .then(resolucao => resolucao.json())
    .then((body) => displayResults(body))
    .catch(error => alert(error.message))
}

function clear() {
  document.querySelector('.form-control').value = "";
}

//resultado do fetch
function displayResults(weather) {

  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  date.innerText = dateBuilder(now);

  let temperature = `${Math.round(weather.main.temp)}`
  temp_number.innerHTML = temperature;
  temp_unit.innerHTML = `°C`;
  low_high.innerText = `Mín ${Math.round(weather.main.temp_min)} °C / Máx ${Math.round(weather.main.temp_max)} °C`;

  let iconName = weather.weather[0].icon;
  img.innerHTML = `<img src="./icons/${iconName}.png">`;

  weather_tempo = weather.weather[0].description;
  weather_t.innerText = capitalizeFirstLetter(weather_tempo)

  humidity.innerHTML = `Umidade: ${weather.main.humidity}%`;
  wind_mph = weather.wind.speed;
  wind.innerHTML = `Vento: ${Math.round(windKmH(wind_mph))} km/h`;

  digital.innerHTML = updateClock();

}

function dateBuilder(d) {
  let days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  let months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julio", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  let day = days[d.getDay()]; //getDay: 0-6
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
}




container_temp.addEventListener('click', changeTemp)
function changeTemp() {
  temp_number_now = temp_number.innerHTML

  if (temp_unit.innerHTML === "°C") {
    let f = (temp_number_now * 1.8) + 32
    temp_unit.innerHTML = "°F"
    temp_number.innerHTML = Math.round(f)
  }
  else {
    let c = (temp_number_now - 32) / 1.8
    temp_unit.innerHTML = "°C"
    temp_number.innerHTML = Math.round(c)
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function windKmH(number) {
  return number * 1.60934
}

