function addDailyForcastRow() {
  let daylyForecastRowElem = document.querySelector(".dayly-forecast-row");
  for (let i = 0; i < 5; i++) {
    daylyForecastRowElem.innerHTML =
      daylyForecastRowElem.innerHTML +
      `<div class="col">
          <div class="line week-day" id="week-day-${i}"></div>
          <div class="line week-temperature">
            <span class="temp-value" id="daily-day-temp-${i}"></span>° /
            <span class="temp-value" id="daily-night-temp-${i}"></span>°
          </div>
          <div class="line">
            <img
              src="svg/01d.svg"
              alt=""
              class="week-weather-img"
              id="week-weather-img-${i}"
            />
          </div>
        </div>
        `;
  }
}

function getThemeElem(currentThemeList) {
  let themeElem = {
    textColorElem: document.querySelectorAll(`.${currentThemeList.textColor}`),
    degreeColorElem: document.querySelectorAll(
      `.${currentThemeList.degreeColor}`
    ),
    currentLocationRowElem: document.querySelector(
      `.${currentThemeList.currentLocationRow}`
    ),
    backgroundColorElem: document.querySelector(
      `.${currentThemeList.backgroundColor}`
    ),
    borderColorElem: document.querySelector(`.${currentThemeList.borderColor}`),
  };

  return themeElem;
}

function getCurrentTheme() {
  if (document.querySelector(".background-color-clear")) {
    return 0;
  }
  if (document.querySelector(".background-color-mostly-cloudy")) {
    return 1;
  }
  if (document.querySelector(".background-color-cloudy")) {
    return 2;
  }
  if (document.querySelector(".background-color-night")) {
    return 3;
  }
}

function updateTheme(themeElem, updateThemeList, currentThemeList) {
  themeElem.textColorElem.forEach((element) => {
    element.classList.remove(currentThemeList.textColor);
    element.classList.add(updateThemeList.textColor);
  });

  themeElem.degreeColorElem.forEach((element) => {
    element.classList.remove(currentThemeList.degreeColor);
    element.classList.add(updateThemeList.degreeColor);
  });

  themeElem.currentLocationRowElem.classList.remove(
    currentThemeList.currentLocationRow
  );
  themeElem.currentLocationRowElem.classList.add(
    updateThemeList.currentLocationRow
  );

  themeElem.backgroundColorElem.classList.remove(
    currentThemeList.backgroundColor
  );
  themeElem.backgroundColorElem.classList.add(updateThemeList.backgroundColor);

  themeElem.borderColorElem.classList.remove(currentThemeList.borderColor);
  themeElem.borderColorElem.classList.add(updateThemeList.borderColor);
}

function checkColorTheme() {
  let colorThemeList = [
    {
      textColor: "text-color-clear",
      degreeColor: "degree-color-clear-hover",
      currentLocationRow: "current-location-row-clear",
      backgroundColor: "background-color-clear",
      borderColor: "border-color-clear",
    },
    {
      textColor: "text-color-mostly-cloudy",
      degreeColor: "degree-color-mostly-cloudy-hover",
      currentLocationRow: "current-location-row-mostly-cloudy",
      backgroundColor: "background-color-mostly-cloudy",
      borderColor: "border-color-mostly-cloudy",
    },
    {
      textColor: "text-color-cloudy",
      degreeColor: "degree-color-cloudy-hover",
      currentLocationRow: "current-location-row-cloudy",
      backgroundColor: "background-color-cloudy",
      borderColor: "border-color-cloudy",
    },
    {
      textColor: "text-color-night",
      degreeColor: "degree-color-night-hover",
      currentLocationRow: "current-location-row-night",
      backgroundColor: "background-color-night",
      borderColor: "border-color-night",
    },
  ];

  let imgNumber = currentDayData.currentWeatherImgNumber;
  let currentThemeList = colorThemeList[getCurrentTheme()];

  let themeElem = getThemeElem(currentThemeList);

  // if true -> set up Clear theme
  if (
    imgNumber === "01d" &&
    themeElem.backgroundColorElem.classList.contains(
      "background-color-clear"
    ) === false
  ) {
    updateTheme(themeElem, colorThemeList[0], currentThemeList);
  }

  // if true -> set up Mostly Cloudy theme
  if (
    (imgNumber === "02d" ||
      imgNumber === "04d" ||
      imgNumber === "10d" ||
      imgNumber === "50d") &&
    themeElem.backgroundColorElem.classList.contains(
      "background-color-mostly-cloudy"
    ) === false
  ) {
    updateTheme(themeElem, colorThemeList[1], currentThemeList);
  }

  // if true -> set up Cloudy theme
  if (
    (imgNumber === "03d" ||
      imgNumber === "09d" ||
      imgNumber === "11d" ||
      imgNumber === "13d") &&
    themeElem.backgroundColorElem.classList.contains(
      "background-color-cloudy"
    ) === false
  ) {
    updateTheme(themeElem, colorThemeList[2], currentThemeList);
  }

  // if true -> set up Night theme
  if (
    imgNumber.slice(2) === "n" &&
    themeElem.backgroundColorElem.classList.contains(
      "background-color-night"
    ) === false
  ) {
    updateTheme(themeElem, colorThemeList[3], currentThemeList);
  }
}

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
  let tempClassList = celsiusElem.classList.toString();

  celsiusElem.classList = fahrenheitElem.classList;
  fahrenheitElem.className = tempClassList;

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
  if (fahrenheitElem.classList.contains("select-degree")) {
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

  checkColorTheme();
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

addDailyForcastRow();

axios.get(apiCallDefault).then(findCity);

citySearchForm.addEventListener("submit", getCityFromSearchForm);
cityExamplesList.forEach(function (cityExampleElement) {
  cityExampleElement.addEventListener("click", getExampleCity);
});

celsiusElem.addEventListener("click", switchDegree);
fahrenheitElem.addEventListener("click", switchDegree);

navigator.geolocation.getCurrentPosition(currentPosition);

// Free to use animated SVG weather icons. Handcrafted by [Bas Milius](https://bas.dev).
