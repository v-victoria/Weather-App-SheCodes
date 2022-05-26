function updateCurrentTime(response) {
  let currentTimeElem = document.querySelector(".time");
  let currentLocationDate = new Date();
  let minutes = currentLocationDate.getUTCMinutes();
  let hours =
    currentLocationDate.getUTCHours() + response.data.timezone_offset / 3600;

  if (hours < 0) {
    hours = 24 + hours;
  }
  if (hours > 24) {
    hours = hours - 24;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  currentTimeElem.innerHTML = `${hours}:${minutes}`;
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
    let apiUrlCurrentWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;

    axios.get(apiUrlCurrentWeather).then(updateWeather);

    displayCity(response);

    citySearchStringForm.value = null;
    citySearchStringForm.blur();
  } else {
    alert("City not found");
  }
}

function GetCoordinatesByLocationName(city) {
  let apiCallGetCoordinatesByLocationName = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  axios.get(apiCallGetCoordinatesByLocationName).then(findCity);
}

function getCityFromSearchForm(event) {
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
  return (value * 9) / 5 + 32;
}

function switchDegree() {
  let celsiusElem = document.querySelector("#celsius");
  let fahrenheitElem = document.querySelector("#fahrenheit");

  if (celsiusElem.className === "select-degree") {
    celsiusElem.className = "not-select-degree";
    fahrenheitElem.className = "select-degree";
  } else {
    celsiusElem.className = "select-degree";
    fahrenheitElem.className = "not-select-degree";
  }
  updateChangingElements();
}

function windLenghtCheck(wind) {
  wind = wind.toFixed(1);
  if (wind.length > 3) {
    wind = Math.round(wind);
  }

  return wind;
}

function getCurrentDayData(response) {
  currentDayData = {
    temperatureCelsius: Math.round(response.data.current.temp),
    temperatureFahrenheit: Math.round(
      celsiusToFahrenheit(response.data.current.temp)
    ),
    description: response.data.current.weather[0].description,
    dayTemperatureCelsius: Math.round(response.data.daily[0].temp.max),
    dayTemperatureFahrenheit: Math.round(
      celsiusToFahrenheit(response.data.daily[0].temp.max)
    ),
    nightTemperatureCelsius: Math.round(response.data.daily[0].temp.min),
    nightTemperatureFahrenheit: Math.round(
      celsiusToFahrenheit(response.data.daily[0].temp.min)
    ),
    humidity: Math.round(response.data.current.humidity),
    windMetric: `${windLenghtCheck(
      response.data.current.wind_speed * 3.6
    )} km/h`,
    windImperial: `${windLenghtCheck(
      response.data.current.wind_speed * 2.3
    )} mi/h`,
    currentWeatherImgNumber: response.data.current.weather[0].icon,
  };
}

function getCurrentDayDataElem() {
  currentDayDataList = {
    temperatureElem: document.querySelector(".tempeture"),
    descriptionElem: document.querySelector(".description"),
    dayTemperatureElem: document.querySelector(".day-temp"),
    nightTemperatureElem: document.querySelector(".night-temp"),
    humidityElem: document.querySelector(".humidity"),
    windElem: document.querySelector("#wind"),
    currentWeatherImgElem: document.querySelector(".current-weather-img"),
  };
}

function getDailyForecastList(response) {
  let weekDays = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];
  let dayOfWeek = new Date();

  let hours = dayOfWeek.getUTCHours() + response.data.timezone_offset / 3600;

  if (hours < 0) {
    dayOfWeek = new Date(dayOfWeek.setDate(dayOfWeek.getDate() - 1));
  }
  if (hours > 24) {
    dayOfWeek = new Date(dayOfWeek.setDate(dayOfWeek.getDate() + 1));
  }

  for (let i = 0; i < 5; i++) {
    dayOfWeek = new Date(dayOfWeek.setDate(dayOfWeek.getDate() + 1));

    let date = dayOfWeek.getDate();

    if (date < 10) {
      date = "0" + date;
    }

    dailyForecastList[i] = {
      date: `${weekDays[dayOfWeek.getDay()]} ${date}`,
      dayTempCelsius: Math.round(response.data.daily[i + 1].temp.max),
      dayTempFahrenheit: Math.round(
        celsiusToFahrenheit(response.data.daily[i + 1].temp.max)
      ),
      nightTempCelsius: Math.round(response.data.daily[i + 1].temp.min),
      nightTempFahrenheit: Math.round(
        celsiusToFahrenheit(response.data.daily[i + 1].temp.min)
      ),
      description: response.data.daily[i + 1].weather[0].icon,
    };
  }
}

function getDailyForecastListElem() {
  for (let i = 0; i < 5; i++) {
    dailyForecastListElem[i] = {
      dateElem: document.querySelector(`#week-day-${i}`),
      dailyDayTempElem: document.querySelector(`#daily-day-temp-${i}`),
      dailyNightTempElem: document.querySelector(`#daily-night-temp-${i}`),
      descriptionImgElem: document.querySelector(`#week-weather-img-${i}`),
    };
  }
}

function updatePermanentElements() {
  currentDayDataList.descriptionElem.innerHTML = currentDayData.description;
  currentDayDataList.currentWeatherImgElem.setAttribute(
    "src",
    `svg/${currentDayData.currentWeatherImgNumber}.svg`
  );

  currentDayDataList.humidityElem.innerHTML = currentDayData.humidity;

  for (let i = 0; i < 5; i++) {
    dailyForecastListElem[i].dateElem.innerHTML = dailyForecastList[i].date;
    dailyForecastListElem[i].descriptionImgElem.setAttribute(
      "src",
      `svg/${dailyForecastList[i].description}.svg`
    );
  }
}

function updateChangingElements() {
  let fahrenheitElem = document.querySelector("#fahrenheit");

  if (fahrenheitElem.className === "select-degree") {
    currentDayDataList.temperatureElem.innerHTML =
      currentDayData.temperatureFahrenheit;
    currentDayDataList.dayTemperatureElem.innerHTML =
      currentDayData.dayTemperatureFahrenheit;
    currentDayDataList.nightTemperatureElem.innerHTML =
      currentDayData.nightTemperatureFahrenheit;
    currentDayDataList.windElem.innerHTML = currentDayData.windImperial;

    for (let i = 0; i < 5; i++) {
      dailyForecastListElem[i].dailyDayTempElem.innerHTML =
        dailyForecastList[i].dayTempFahrenheit;
      dailyForecastListElem[i].dailyNightTempElem.innerHTML =
        dailyForecastList[i].nightTempFahrenheit;
    }
  } else {
    currentDayDataList.temperatureElem.innerHTML =
      currentDayData.temperatureCelsius;
    currentDayDataList.dayTemperatureElem.innerHTML =
      currentDayData.dayTemperatureCelsius;
    currentDayDataList.nightTemperatureElem.innerHTML =
      currentDayData.nightTemperatureCelsius;
    currentDayDataList.windElem.innerHTML = currentDayData.windMetric;

    for (let i = 0; i < 5; i++) {
      dailyForecastListElem[i].dailyDayTempElem.innerHTML =
        dailyForecastList[i].dayTempCelsius;
      dailyForecastListElem[i].dailyNightTempElem.innerHTML =
        dailyForecastList[i].nightTempCelsius;
    }
  }
}

function updateWeather(response) {
  getCurrentDayDataElem();
  getCurrentDayData(response);
  getDailyForecastListElem();
  getDailyForecastList(response);

  updatePermanentElements();
  updateChangingElements();

  updateCurrentTime(response);
}

function currentPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiUrlCurrentWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;
  let apiUrlCurrentLocation = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`;

  axios.get(apiUrlCurrentWeather).then(updateWeather);
  axios.get(apiUrlCurrentLocation).then(displayCity);
}

let apiKey = "294b1233d0859b30eceddba0fee44100";

let citySearchForm = document.querySelector("#search-form");
let celsiusElem = document.querySelector("#celsius");
let fahrenheitElem = document.querySelector("#fahrenheit");
let apiCallDefault = `https://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=${apiKey}`;
let cityExamplesList = document.querySelectorAll(".city-example");

let currentDayData = {};
let currentDayDataList = {};
let dailyForecastList = [];
let dailyForecastListElem = [];

axios.get(apiCallDefault).then(findCity);

citySearchForm.addEventListener("submit", getCityFromSearchForm);
cityExamplesList.forEach(function (cityExampleElement, index) {
  cityExampleElement.addEventListener("click", getExampleCity);
});

celsiusElem.addEventListener("click", switchDegree);
fahrenheitElem.addEventListener("click", switchDegree);

navigator.geolocation.getCurrentPosition(currentPosition);

// Free to use animated SVG weather icons. Handcrafted by [Bas Milius](https://bas.dev).
