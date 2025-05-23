const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const cityName = document.getElementById('cityName');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const feelsLike = document.getElementById('feelsLike');
const weatherIcon = document.getElementById('weatherIcon');

// Event listeners
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Search weather function
async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    try {
        showLoading();
        const weatherData = await fetchWeatherData(city);
        displayWeather(weatherData);
    } catch (error) {
        showError('City not found. Please try again.');
    }
}

// Fetch weather data from API
async function fetchWeatherData(city) {
    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Weather data not found');
    }
    
    return await response.json();
}

// Display weather information
function displayWeather(data) {
    const {
        name,
        main: { temp: temperature, humidity: humidityValue, feels_like },
        weather: [{ description: desc, icon }],
        wind: { speed }
    } = data;
    
    cityName.textContent = name;
    temp.textContent = Math.round(temperature);
    description.textContent = desc;
    humidity.textContent = `${humidityValue}%`;
    windSpeed.textContent = `${speed} m/s`;
    feelsLike.textContent = `${Math.round(feels_like)}°C`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    weatherIcon.alt = desc;
    
    weatherDisplay.classList.add('show');
    clearError();
}

// Show loading state
function showLoading() {
    weatherDisplay.innerHTML = `
        <div style="color: white; padding: 20px;">
            <p>Loading weather data...</p>
        </div>
    `;
    weatherDisplay.classList.add('show');
}

// Show error message
function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error">
            <p>${message}</p>
        </div>
    `;
    weatherDisplay.classList.add('show');
}

// Clear error messages
function clearError() {
    const errorElement = document.querySelector('.error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Get user's current location weather (optional feature)
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const url = `${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
                const response = await fetch(url);
                const data = await response.json();
                displayWeather(data);
            } catch (error) {
                showError('Unable to fetch weather for your location');
            }
        });
    }
}
