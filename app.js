const API_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "2a7931e7ddf2d5524fb8f52d862accea";

const searchBtn = document.getElementById("searchBtn");
const currentLocationBtn = document.getElementById("currentLocationBtn");
const cityInput = document.getElementById("cityInput");
const recentCitiesDropdown = document.getElementById("recentCities");
const errorMessage = document.getElementById("errorMessage");

// Weather display elements
const locationEl = document.getElementById("location");
const temperatureEl = document.getElementById("temperature");
const feelLikeEl = document.getElementById("feel-like");
const descriptionEl = document.getElementById("description");
const weatherIconEl = document.querySelector(".weatherIcon");
const dateEl = document.getElementById("date");

// Weather highlights
const humidityEl = document.getElementById("Hvalue");
const windSpeedEl = document.getElementById("Wvalue");
const cloudinessEl = document.getElementById("Cvalue");
const pressureEl = document.getElementById("Pvalue");
const sunriseEl = document.getElementById("SRValue");
const sunsetEl = document.getElementById("SSValue");

// Forecast container
const forecastContainer = document.getElementById("forecast");

// Load recent cities from localStorage
const loadRecentCities = () => {
    const cities = JSON.parse(localStorage.getItem("recentCities")) || [];
    recentCitiesDropdown.innerHTML = cities.length > 0
        ? `<option>Select a city</option>` + cities.map(city => `<option>${city}</option>`).join("")
        : "";
    recentCitiesDropdown.classList.toggle("hidden", cities.length === 0);  //notany dropdown if there is no searched city.
};

// Fetch weather data
const fetchWeather = async (city) => {
    if (!city) return; // Prevent empty city requests

    try {
        errorMessage.classList.add("hidden");

        const res = await fetch(`${API_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`);
        if (!res.ok) throw new Error("City not found!");

        const data = await res.json();

        // Save city to recent searches
        let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
        if (!cities.includes(city)) {
            cities.push(city);
            localStorage.setItem("recentCities", JSON.stringify(cities));
        }
        loadRecentCities();

        // Update UI
        locationEl.textContent = `${data.name}, ${data.sys.country}`;
        temperatureEl.textContent = `🌡️ ${data.main.temp}°C`;
        feelLikeEl.textContent = `Feels like: ${data.main.feels_like}°C`;
        descriptionEl.textContent = data.weather[0].description;
        weatherIconEl.style.backgroundImage = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}.png)`;
        dateEl.textContent = new Date().toLocaleDateString();

        // Weather highlights
        humidityEl.textContent = `${data.main.humidity}%`;
        windSpeedEl.textContent = `${data.wind.speed} m/s`;
        cloudinessEl.textContent = `${data.clouds.all}%`;
        pressureEl.textContent = `${data.main.pressure} hPa`;
        sunriseEl.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        sunsetEl.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();

        fetchUVIndex(data.coord.lat, data.coord.lon);
        fetchForecast(city);
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove("hidden");
    }
};

// Fetch UV Index
const fetchUVIndex = async (lat, lon) => {
    try {
        const res = await fetch(`${API_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${API_KEY}`);
        if (!res.ok) throw new Error("UV index data unavailable!");

        const data = await res.json();
        uvIndexEl.textContent = `${data.current.uvi}`;
    } catch (error) {
        uvIndexEl.textContent = "N/A"; // Default to N/A if fetching fails
    }
};

// Fetch 5-day forecast
const fetchForecast = async (city) => {
    try {
        forecastContainer.innerHTML = "";
        const res = await fetch(`${API_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`);
        if (!res.ok) throw new Error("Forecast not available!");

        const data = await res.json();
        data.list.filter((_, i) => i % 8 === 0).forEach(day => {
            const date = new Date(day.dt_txt).toDateString();
            forecastContainer.innerHTML += `
                <div class="bg-gray-500 p-3 rounded-lg text-center shadow-lg">
                    <p class="font-bold text-white">${date}</p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" class="mx-auto" alt="Weather">
                    <p>🌡️ ${day.main.temp}°C</p>
                    <p>💧 ${day.main.humidity}%</p>
                    <p>💨 ${day.wind.speed} m/s</p>
                </div>
            `;
        });
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove("hidden");
    }
};

// Search weather by city
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

// Get user's current location
currentLocationBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`${API_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
            if (!res.ok) throw new Error("Unable to fetch location data!");

            const data = await res.json();
            fetchWeather(data.name);
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove("hidden");
        }
    }, () => {
        errorMessage.textContent = "Location access denied!";
        errorMessage.classList.remove("hidden");
    });
});

// Handle recent city selection
recentCitiesDropdown.addEventListener("change", () => {
    if (recentCitiesDropdown.value !== "Select a city") {
        fetchWeather(recentCitiesDropdown.value);
    }
});

// Load recent cities on page load
loadRecentCities();
