function currentTime() {
  let date = new Date();
  let minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let returnString = `${date.getHours()}:${minutes}`;
  return returnString;
}

function metricOrImperialUnits() {
  let fahrenheitElem = document.querySelector("#fahrenheit");

  if (fahrenheitElem.className === "select-degree") {
    return "imperial";
  } else {
    return "metric";
  }
}

function displayCity(response) {
  let currentLocationText = document.querySelector(".current-location-text");

  let cityName = response.data[0].name;
  let state = response.data[0].state;
  let country = response.data[0].country;

  if (state != null && state != cityName) {
    currentLocationText.innerHTML = `${cityName}, ${state}, ${country}`;
  } else {
    currentLocationText.innerHTML = `${cityName}, ${country}`;
  }
}

function findCity(response) {
  if (response.data.length != 0) {
    let citySearchStringForm = document.querySelector(".search-input");
    let lat = response.data[0].lat;
    let lon = response.data[0].lon;
    let units = metricOrImperialUnits();
    let apiUrlCurrentWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=${units}`;

    axios.get(apiUrlCurrentWeather).then(updateWeather);

    displayCity(response);

    citySearchStringForm.value = null;
    citySearchStringForm.blur();
  } else {
    alert("City not found");
  }
}

function GetCoordinatesByLocationName(city) {
  let apiCallGetCoordinatesByLocationName = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  axios.get(apiCallGetCoordinatesByLocationName).then(findCity);
}

function getCity(event) {
  event.preventDefault();

  let citySearchStringForm = document.querySelector(".search-input");
  let city = citySearchStringForm.value.trim();

  if (city !== "") {
    GetCoordinatesByLocationName(city);
  } else {
    alert("Type the city and try again");
  }
}

function getExampleCity(event) {
  let city = event.target.innerHTML;
  GetCoordinatesByLocationName(city);
}

function celsiusToFahrenheit(value) {
  return Math.round((value * 9) / 5 + 32);
}

function fahrenheitToCelsius(value) {
  return Math.round(((value - 32) * 5) / 9);
}

function switchClasses() {
  let celsiusElem = document.querySelector("#celsius");
  let fahrenheitElem = document.querySelector("#fahrenheit");

  if (celsiusElem.className === "select-degree") {
    celsiusElem.className = "not-select-degree";
    fahrenheitElem.className = "select-degree";
  } else {
    celsiusElem.className = "select-degree";
    fahrenheitElem.className = "not-select-degree";
  }
}

function switchingDeegres(event) {
  if (event.target.className === "not-select-degree") {
    let tempetureElemList = document.querySelectorAll(".temp-value");
    let windElem = document.querySelector("#wind");
    let wind = windElem.innerHTML.slice(0, -5);

    if (event.target.innerHTML === "℉") {
      for (let i = 0; i < tempetureElemList.length; i++) {
        tempetureElemList[i].innerHTML = celsiusToFahrenheit(
          tempetureElemList[i].innerHTML
        );
      }
      wind = wind / 1.6;
      wind = windLenghtCheck(wind);
      windElem.innerHTML = `${wind} mi/h`;
    } else {
      for (let i = 0; i < tempetureElemList.length; i++) {
        tempetureElemList[i].innerHTML = fahrenheitToCelsius(
          tempetureElemList[i].innerHTML
        );
      }
      wind = wind * 1.6;
      wind = windLenghtCheck(wind);
      windElem.innerHTML = `${wind} km/h`;
    }

    switchClasses();
  }
}

function updateCurrentTempDescription(response) {
  let temperature = Math.round(response.data.current.temp);
  let tempetureElem = document.querySelector(".tempeture");
  let description = response.data.current.weather[0].main;
  let descriptionElem = document.querySelector(".sky");

  tempetureElem.innerHTML = temperature;
  descriptionElem.innerHTML = description;
}

function updateDayNightTemp(response) {
  let dayTempeture = Math.round(response.data.daily[0].temp.day);
  let dayTempetureElem = document.querySelector(".day-temp");

  let nightTempeture = Math.round(response.data.daily[0].temp.night);
  let nightTempetureElem = document.querySelector(".night-temp");

  dayTempetureElem.innerHTML = dayTempeture;
  nightTempetureElem.innerHTML = nightTempeture;
}

function windLenghtCheck(wind) {
  wind = wind.toFixed(1);
  return wind;
}

function updateHumidityWind(response) {
  let humidity = Math.round(response.data.current.humidity);
  let humidityElem = document.querySelector(".humidity");

  let wind = response.data.current.wind_speed;
  let windElem = document.querySelector("#wind");

  let fahrenheitElem = document.querySelector("#fahrenheit");

  humidityElem.innerHTML = humidity;

  if (fahrenheitElem.className === "select-degree") {
    wind = windLenghtCheck(wind);
    windElem.innerHTML = `${wind} mi/h`;
  } else {
    wind = wind * 3.6;
    wind = windLenghtCheck(wind);
    windElem.innerHTML = `${wind} km/h`;
  }
}

function updateWeather(response) {
  // console.log(response);
  updateCurrentTempDescription(response);
  updateDayNightTemp(response);
  updateHumidityWind(response);
  updateWeatherForecast(response);
}

function getDailyForecastList(response) {
  let dailyForecastList = [];
  for (let i = 0; i < 5; i++) {
    dailyForecastList[i] = {
      date: "0",
      dayTemp: Math.round(response.data.daily[i + 1].temp.day),
      nightTemp: Math.round(response.data.daily[i + 1].temp.night),
      description: response.data.daily[i + 1].weather[0].main,
    };
  }
  return dailyForecastList;
}

function getDailyForecastListElem() {
  let dailyForecastListElem = [];

  for (let i = 0; i < 5; i++) {
    dailyForecastListElem[i] = {
      dateElem: "0",
      dailyDayTempElem: document.querySelector(`#daily-day-temp-${i}`),
      dailyNightTempElem: document.querySelector(`#daily-night-temp-${i}`),
      descriptionIconElem: "0",
    };
  }
  return dailyForecastListElem;
}

function updateWeatherForecast(response) {
  let dailyForecastList = getDailyForecastList(response);
  let dailyForecastListElem = getDailyForecastListElem();

  for (let i = 0; i < 5; i++) {
    dailyForecastListElem[i].dailyDayTempElem.innerHTML =
      dailyForecastList[i].dayTemp;
    dailyForecastListElem[i].dailyNightTempElem.innerHTML =
      dailyForecastList[i].nightTemp;
  }
}

function currentPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let units = metricOrImperialUnits();
  let apiUrlCurrentWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=${units}`;
  let apiUrlCurrentLocation = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`;

  axios.get(apiUrlCurrentWeather).then(updateWeather);
  axios.get(apiUrlCurrentLocation).then(displayCity);
}

let apiKey = "294b1233d0859b30eceddba0fee44100";
let days = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];

let currentTimeElem = document.querySelector(".time");
let citySearchForm = document.querySelector("#search-form");
let celsiusElem = document.querySelector("#celsius");
let fahrenheitElem = document.querySelector("#fahrenheit");
let apiCallDefault = `http://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=${apiKey}`;
let cityExamplesList = document.querySelectorAll(".city-example");

axios.get(apiCallDefault).then(findCity);

currentTimeElem.innerHTML = currentTime();

citySearchForm.addEventListener("submit", getCity);
cityExamplesList.forEach(function (cityExampleElement, index) {
  cityExampleElement.addEventListener("click", getExampleCity);
});

celsiusElem.addEventListener("click", switchingDeegres);
fahrenheitElem.addEventListener("click", switchingDeegres);

navigator.geolocation.getCurrentPosition(currentPosition);

// Free to use animated SVG weather icons. Handcrafted by [Bas Milius](https://bas.dev).
