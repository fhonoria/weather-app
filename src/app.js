//Day & Time
let now = new Date();

let currentHour = now.getHours();
if (currentHour < 10) {
  currentHour = `0${currentHour}`;
}
let currentMinute = now.getMinutes();
if (currentMinute < 10) {
  currentMinute = `0${currentMinute}`;
}

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let currentDay = days[now.getDay()];

let changeDay = document.querySelector("#current-day");
changeDay.innerHTML = currentDay;

let changeTime = document.querySelector("#current-time");
changeTime.innerHTML = currentHour + ":" + currentMinute;

//search engine

let apiKey = "9840a840dcb1e2ca4cd13597387da153";
let unit = "metric";

function DisplayWeatherCondition(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#degree").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = response.data.wind.speed;

  document
    .querySelector("#weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#weather-icon")
    .setAttribute(
      "alt",
      `http://openweathermap.org/img/wn/${response.data.weather[0].description}@2x.png`
    );

  celsiusTemperature = Math.round(response.data.main.temp);
  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(DisplayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

let searchForm = document.querySelector("#submit-button");
searchForm.addEventListener("click", handleSubmit);

searchCity("Budapest");

//current Button

function searchLocation(position) {
  let apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrlCurrent).then(DisplayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

//unit conversion

function fahrenheitTemperatureDisplay(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  document.querySelector("#degree").innerHTML = Math.round(
    (celsiusTemperature * 9) / 5 + 32
  );
}

function celsiusTemperatureDisplay(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  document.querySelector("#degree").innerHTML = celsiusTemperature;
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", fahrenheitTemperatureDisplay);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", celsiusTemperatureDisplay);

//forecast

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayForecast);
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function displayForecast(response) {
  console.log(response);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";
  forecastData = response.data.daily;

  forecastData.forEach(function (forecast, index) {
    if (index < 3) {
      forecastHTML =
        forecastHTML +
        `<div class="row">
            <div class="col-2">${formatForecastDay(forecast.dt)}</div>
            <div class="col-3" id="forecast-weather-icon">
              <img
                src="http://openweathermap.org/img/wn/${
                  forecast.weather[0].icon
                }@2x.png"
                alt=""
                width="70"
              />
            </div>
            <div class="col-3">
              <span id="forecast-temp-max">${Math.round(
                forecast.temp.max
              )}</span
              ><span id="forecast-unit">°C</span>
              <span id="forecast-temp-min"
                >${Math.round(
                  forecast.temp.min
                )}<span id="forecast-unit">°C</span>
              </span>
            </div>
            <div class="col-4" id="description">${
              forecast.weather[0].description
            }</div>
          </div>`;

      forecastElement.innerHTML = forecastHTML;
    }
  });
}
