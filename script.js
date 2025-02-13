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
const SRvalue = document.getElementById("SRvalue");
const SSvalue = document.getElementById("SSvalue");
const Cvalue = document.getElementById("Cvalue");
const UVvalue = document.getElementById("UVvalue");
const Pvalue = document.getElementById("Pvalue");

// API Key & Base URL (Replace with your API key)
const API_KEY = "2a7931e7ddf2d5524fb8f52d862accea";  
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Function to Fetch Weather Data
async function fetchWeatherData(cityName) {
    try {
        const response = await fetch(`${BASE_URL}?q=${cityName}&units=metric&appid=${API_KEY}`);
        if (!response.ok) throw new Error("City not found!");

        const data = await response.json();
        console.log(data); // Debugging: See the API response in console

        updateWeatherUI(data);
    } catch (error) {
        alert(error.message);
    }
}

// Function to Update the Weather UI
function updateWeatherUI(data) {
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    feelslike.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    description.textContent = data.weather[0].description;
    city.textContent = `${data.name}, ${data.sys.country}`;
    
    Hvalue.textContent = `${data.main.humidity}%`;
    Wvalue.textContent = `${data.wind.speed} m/s`;
    SRvalue.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    SSvalue.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    Cvalue.textContent = `${data.clouds.all}%`;
    Pvalue.textContent = `${data.main.pressure} hPa`;
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
