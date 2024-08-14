document.getElementById('getWeather').addEventListener('click', async () => {
    const city = document.getElementById('city').value;
    if (city) {
        try {
            const coords = await getCoordinates(city);
            if (coords) {
                getWeather(coords.lat, coords.lon);
            }
            else {
                alert('City not found');
            }
        }
        catch (error) {
            alert('Failed to get coordinates');
        }
    } else 
    {
        alert('Please enter a city name');
    }
});

async function getCoordinates(city) {
    try {
        const response = await fetch(`https://geocode.xyz/${city}?json=1`);
        const data = await response.json();

        if (data.latt && data.longt) {
            return {lat: data.latt, lon: data.longt};
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null
    }
}

async function getWeather(lat, lon) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (data.current_weather) {
            displayWeather(data);
        } else {
            alert('Failed to fetch weather data');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data');
    }
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weather');
    weatherDiv.innerHTML = `
        <h2>Weather Data</h2>
        <p>Temperature: ${data.current_weather.temperature.toFixed(1)}°C / ${(data.current_weather.temperature * 9/5 +32).toFixed(1)}°F </p>
        <p>Wind Speed: ${data.current_weather.windspeed.toFixed(1)} km/h / ${(data.current_weather.windspeed * 0.621371).toFixed(1)} mph </p>
        <p>Wind Direction: ${data.current_weather.winddirection}°</p>
        <p>Humidity: ${data.current_weather.humidity}%</p>
        <p>Pressure: ${data.current_weather.pressure} hPa</p>
        <p>Cloud Cover: ${data.current_weather.cloudcover}%</p>
        <p>Visibility: ${(data.current_weather.visibility / 1000).toFixed(1)} km</p>
        <p>Weather Code: ${data.current_weather.weathercode}</p>
        <p>Time of Data: ${data.current_weather.time}</p>
    `;
}

module.exports = {getWeather, displayWeather}; 
