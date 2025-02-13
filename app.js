// Selecting DOM Elements
const userLocation = document.getElementById("user-location");
const converter = document.getElementById("converter");
const temperature = document.querySelector(".temperature");
const feelslike = document.querySelector(".feel-like");
const description = document.querySelector(".description");
const date = document.querySelector(".date");
const city = document.querySelector(".city");
const Hvalue = document.getElementById("Hvalue");
const Wvalue = document.getElementById("Wvalue");
const SRvalue = document.getElementById("SRValue");
const SSvalue = document.getElementById("SSValue");
const Cvalue = document.getElementById("Cvalue");
const UVvalue = document.getElementById("UVvalue");
const Pvalue = document.getElementById("Pvalue");

// API Key & Base URL
const API_KEY = "2a7931e7ddf2d5524fb8f52d862accea";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=2a7931e7ddf2d5524fb8f52d862accea&units=metric&q=`;
const WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/2.5/onecall?appid=${API_KEY}&exclude=minutely&units=metric&`;

// Wait until the DOM is fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search-btn");

    if (searchBtn) {
        searchBtn.addEventListener("click", findUserLocation);
    } else {
        console.error("Search button not found!");
    }

    converter.addEventListener("change", convertTemperature);
});

// Function to Fetch Weather Data
async function findUserLocation() {
    const location = userLocation.value.trim();
    if (!location) {
        alert("Please enter a location!");
        return;
    }

    try {
        // Fetch Current Weather Data
        const response = await fetch(WEATHER_API_ENDPOINT + location);
        const data = await response.json();

        if (data.cod !== 200) {
            alert(data.message);
            return;
        }

        console.log("Current Weather Data:", data);
        city.innerHTML = `${data.name}, ${data.sys.country}`;

        // Remove existing weather icon if any
        const existingIcon = document.querySelector(".weatherIcon");
        if (existingIcon) existingIcon.remove();

        // Weather Icon
        const weatherIcon = document.createElement("div");
        weatherIcon.classList.add("weatherIcon");
        weatherIcon.style.backgroundImage = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
        document.querySelector(".temperature").before(weatherIcon);

        // Fetch More Weather Details
        const detailedResponse = await fetch(
            `${WEATHER_DATA_ENDPOINT}lon=${data.coord.lon}&lat=${data.coord.lat}`
        );
        const weatherData = await detailedResponse.json();
        console.log("Detailed Weather Data:", weatherData);

        // Updating UI
        temperature.dataset.tempC = weatherData.current.temp; // Store original temp in dataset
        updateTemperatureDisplay();
        feelslike.innerHTML = `Feels Like: ${Math.round(weatherData.current.feels_like)}°C`;
        description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp; ${weatherData.current.weather[0].description}`;

        Hvalue.innerHTML = `${Math.round(weatherData.current.humidity)}<span>%</span>`;
        Wvalue.innerHTML = `${Math.round(weatherData.current.wind_speed)}<span> m/s</span>`;

        // Time Formatting
        const options = { hour: "numeric", minute: "numeric", hour12: true };
        SRvalue.innerHTML = formatUnixTime(weatherData.current.sunrise, weatherData.timezone_offset, options);
        SSvalue.innerHTML = formatUnixTime(weatherData.current.sunset, weatherData.timezone_offset, options);

        Cvalue.innerHTML = `${Math.round(weatherData.current.clouds)}<span>%</span>`;
        UVvalue.innerHTML = `${Math.round(weatherData.current.uvi)}`;
        Pvalue.innerHTML = `${Math.round(weatherData.current.pressure)}<span> hPa</span>`;

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Function to Convert Temperature Units
function convertTemperature() {
    const unit = converter.value;
    let tempC = parseFloat(temperature.dataset.tempC);

    if (unit === "F") {
        temperature.innerHTML = `${Math.round(tempC * 9/5 + 32)}°F`;
    } else {
        temperature.innerHTML = `${Math.round(tempC)}°C`;
    }
}

// Function to Convert Unix Timestamp to Readable Format
function formatUnixTime(dtValue, offset, options = {}) {
    const date = new Date((dtValue + offset) * 1000);
    return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
}

// Update temperature display
function updateTemperatureDisplay() {
    const tempC = parseFloat(temperature.dataset.tempC);
    if (converter.value === "F") {
        temperature.innerHTML = `${Math.round(tempC * 9/5 + 32)}°F`;
    } else {
        temperature.innerHTML = `${Math.round(tempC)}°C`;
    }
}
