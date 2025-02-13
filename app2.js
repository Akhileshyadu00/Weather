// Selecting DOM Elements
const userLocation = document.getElementById("user-location");
const converter = document.getElementById("converter");
const weatherIcon = document.querySelector(".weatherIcon"); // Fixed selection
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

// API Key & Base URLs
const API_KEY = "2a7931e7ddf2d5524fb8f52d862accea";
const WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&q=`;
const WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/2.5/onecall?appid=${API_KEY}&exclude=minutely&units=metric&`;

// Function to Fetch Weather Data
function findUserLocation() {
    fetch(WEATHER_API_ENDPOINT + userLocation.value)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod !== 200) { // Fixed error checking
                alert(data.message);
                return;
            }
            console.log("Coordinates:", data.coord.lon, data.coord.lat);

            // Update UI
            city.innerHTML = `${data.name}, ${data.sys.country}`; 

            // Set Weather Icon
            if (weatherIcon) {
                weatherIcon.style.backgroundImage = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
            }

            // Fetch more detailed weather data
            fetch(`${WEATHER_DATA_ENDPOINT}lat=${data.coord.lat}&lon=${data.coord.lon}`)
                .then((response) => response.json())
                .then((weatherData) => {
                    console.log("Detailed Weather Data:", weatherData);

                    // Update UI with weather details
                    temperature.innerHTML = `${Math.round(weatherData.current.temp)}°C`;
                    feelslike.innerHTML = `Feels Like: ${Math.round(weatherData.current.feels_like)}°C`;
                    description.innerHTML = weatherData.current.weather[0].description;

                    Hvalue.innerHTML = `${Math.round(weatherData.current.humidity)}<span>%</span>`;
                    Wvalue.innerHTML = `${Math.round(weatherData.current.wind_speed)}<span> m/s</span>`;
                    Cvalue.innerHTML = `${Math.round(weatherData.current.clouds)}<span>%</span>`;
                    UVvalue.innerHTML = `${Math.round(weatherData.current.uvi)}`;
                    Pvalue.innerHTML = `${Math.round(weatherData.current.pressure)}<span> hPa</span>`;

                    // Format sunrise/sunset times
                    SRvalue.innerHTML = formatUnixTime(weatherData.current.sunrise, weatherData.timezone_offset);
                    SSvalue.innerHTML = formatUnixTime(weatherData.current.sunset, weatherData.timezone_offset);
                })
                .catch((error) => console.error("Error fetching detailed weather data:", error));
        })
        .catch((error) => console.error("Error fetching weather data:", error));
}

// Function to Convert Unix Timestamp to Readable Format
function formatUnixTime(dtValue, offset) {
    const date = new Date((dtValue + offset) * 1000);
    return date.toLocaleTimeString([], { timeZone: "UTC", hour: "numeric", minute: "numeric", hour12: true });
}
