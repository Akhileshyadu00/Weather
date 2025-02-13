// Selecting DOM Elements
const userLocation = document.getElementById("user-location");
const converter = document.getElementById("converter");
const weatherIcon = document.querySelector(".weatherIcon img"); // Ensure it's an <img> tag
const temperature = document.querySelector(".temperature");
const feelslike = document.querySelector(".feel-like");
const description = document.querySelector(".description");
const city = document.querySelector(".city");
const Hvalue = document.getElementById("Hvalue");
const Wvalue = document.getElementById("Wvalue");
const Cvalue = document.getElementById("Cvalue");
const Pvalue = document.getElementById("Pvalue");
const forecastContainer = document.getElementById("forecast"); // Forecast container

// API Key & Base URL (Replace with your API key)
const API_KEY = "2a7931e7ddf2d5524fb8f52d862accea";  
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const ONECALL_URL = "https://api.openweathermap.org/data/2.5/onecall";

// Function to Fetch Weather Data
async function fetchWeatherData(cityName) {
    try {
        const response = await fetch(`${BASE_URL}?q=${cityName}&units=metric&appid=${API_KEY}`);
        if (!response.ok) throw new Error("City not found!");

        const data = await response.json();
        console.log("Current Weather Data:", data); // Debugging: See the API response in console

        updateWeatherUI(data);
        fetchForecastData(data.coord.lat, data.coord.lon); // Fetch 7-day forecast
    } catch (error) {
        alert(error.message);
    }
}

// Function to Fetch 7-Day Forecast
async function fetchForecastData(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=2a7931e7ddf2d5524fb8f52d862accea`);
        if (!response.ok) throw new Error("Forecast data unavailable!");

        const forecastData = await response.json();
        console.log("Forecast Data:", forecastData);

        updateForecastUI(forecastData.daily);
    } catch (error) {
        alert(error.message);
    }
}

// Function to Update the Weather UI
function updateWeatherUI(data) {
    if (!data.weather || !data.weather[0]) {
        alert("Weather data is unavailable.");
        return;
    }

   // weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    feelslike.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    description.textContent = data.weather[0].description;
    city.textContent = `${data.name}, ${data.sys.country}`;

    Hvalue.textContent = `${data.main.humidity}%`;
    Wvalue.textContent = `${data.wind.speed} m/s`;
    Cvalue.textContent = `${data.clouds.all}%`;
    Pvalue.textContent = `${data.main.pressure} hPa`;
}

// Function to Update the Forecast UI
function updateForecastUI(dailyForecast) {
    forecastContainer.innerHTML = ""; // Clear previous forecast

    dailyForecast.forEach((day, index) => {
        if (index === 0) return; // Skip today's data

        let div = document.createElement("div");
        div.classList.add("forecast-item");

        let date = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' });

        div.innerHTML = `
            <p>${date}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
            <p class="forecast-desc">${day.weather[0].description}</p>
            <p>Temp: ${Math.round(day.temp.day)}°C</p>
        `;

        forecastContainer.appendChild(div);
    });
}

// Function to Handle Search Button Click
function findUserLocation() {
    const location = userLocation.value.trim();
    if (location) {
        fetchWeatherData(location);
    } else {
        alert("Please enter a city name.");
    }
}

// Event Listener for Search Button
document.querySelector(".fa-magnifying-glass").addEventListener("click", findUserLocation);

// Event Listener for "Enter" Key Press in Input
userLocation.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        findUserLocation();
    }
});
