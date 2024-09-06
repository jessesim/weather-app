document.getElementById('getWeather').addEventListener('click', async () => {
  const city = document.getElementById('city').value.trim();
  const loadingMessage = document.getElementById('loading-message');
  loadingMessage.textContent = 'Please wait...'; // Display loading message

  if (city) {
    try {
      // Attempt to get coordinates for the specified city
      const coords = await getCoordinates(city);
      if (coords) {
        // Fetch weather data if coordinates are successfully retrieved
        await getWeather(coords.lat, coords.lon);
      } else {
        alert('City not found or invalid input');
      }
    } catch (error) {
      alert('Failed to get coordinates');
    }
    loadingMessage.textContent = ''; // Clear loading message after processing
  } else {
    alert('Please enter a valid city name');
    loadingMessage.textContent = ''; // Clear message if no city is entered
  }
});

async function getCoordinates(city, retries = 5, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Fetch coordinates from geocode API
      const response = await fetch(`https://geocode.xyz/${city}?json=1`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      // Parse the response as JSON
      const data = await response.json();
      console.log('Geocode API response:', data); // Log response for debugging

      // Check if latitude and longitude are present
      if (data.latt && data.longt) {
        return { lat: parseFloat(data.latt), lon: parseFloat(data.longt) };
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error); // Log failed attempt
      if (attempt < retries) await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
    }
  }
  return null; // Return null if all attempts fail
}

async function getWeather(lat, lon, retries = 5, delay = 1000) {
  const loadingMessage = document.getElementById('loading-message');
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Fetch weather data using the provided coordinates
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      // Parse the response as JSON
      const data = await response.json();

      // Check if current weather data is available
      if (data.current_weather) {
        displayWeather(data);
        loadingMessage.textContent = ''; // Clear loading message on success
        return;
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error); // Log failed attempt
      if (attempt < retries) await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
    }
  }
  alert('Failed to fetch weather data after multiple attempts'); // Notify user of failure
  loadingMessage.textContent = ''; // Clear loading message on failure
}

function displayWeather(data) {
  const weatherDiv = document.getElementById('weather');
  weatherDiv.innerHTML = `
    <h2>Weather Data</h2>
    <p>Temperature: ${data.current_weather.temperature.toFixed(1)}°C / ${(data.current_weather.temperature * 9/5 + 32).toFixed(1)}°F</p>
    <p>Wind Speed: ${data.current_weather.windspeed.toFixed(1)} km/h / ${(data.current_weather.windspeed * 0.621371).toFixed(1)} mph</p>
    <p>Wind Direction: ${data.current_weather.winddirection}°</p>
  `;
}