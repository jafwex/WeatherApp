const apiKey = 'f1d510bab1f0a23c3e98555c2d96b688'; // OpenWeatherMap API key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');

async function getWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        weatherInfo.style.display = 'none';
        weatherInfo.innerHTML = '<p>Loading...</p>';

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            displayWeather(data);
        } else {
            throw new Error(data.message || 'City not found');
        }
    } catch (error) {
        weatherInfo.style.display = 'block';
        weatherInfo.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

async function getWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        weatherInfo.style.display = 'none';
        weatherInfo.innerHTML = '<p>Loading...</p>';

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            displayWeather(data);
        } else {
            throw new Error('Weather data not found');
        }
    } catch (error) {
        weatherInfo.style.display = 'block';
        weatherInfo.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayWeather(data) {
    const { name, main, weather } = data;
    const weatherIcon = weather[0].icon;

    weatherInfo.style.display = 'block';
    weatherInfo.innerHTML = `
    <i class="bx bx-${weatherIcon.includes('n') ? 'moon' : 'sun'}"></i>
    <h2>${name}</h2>
    <p>Temperature: ${main.temp} °C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Condition: ${weather[0].description}</p>
  `;
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        alert('Please enter a city name or use your current location.');
    }
});

document.getElementById('location-btn').addEventListener('click', () => {
    getUserLocation();
});


function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoords(lat, lon);
        }, (error) => {
            console.error(error);
            weatherInfo.style.display = 'block';
            weatherInfo.innerHTML = `<p class="error">Unable to retrieve your location</p>`;
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}
