const userLocation = document.getElementById("user-location");
const converter = document.getElementById("converter");
const weatherIcon = document.querySelector(".weatherIcon");
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


function findUserLocation() {
    alert(1);
}