// __tests__/app.test.js

const { getWeather, displayWeather } = require('../app.js');

// Mock Fetch API
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
            cod: 200,
            name: 'London',
            sys: { country: 'GB' },
            main: { temp: 20, humidity: 60 },
            weather: [{ description: 'clear sky' }],
            wind: { speed: 5 }
        })
    })
);

describe('Weather App', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input type="text" id="city" placeholder="Enter city name">
            <button id="getWeather">Get Weather</button>
            <div id="weather"></div>
        `;
    });

    test('fetches weather data for a city', async () => {
        await getWeather('London');
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('London')
        );
    });

    test('displays weather data correctly', () => {
        const data = {
            name: 'London',
            sys: { country: 'GB' },
            main: { temp: 20, humidity: 60 },
            weather: [{ description: 'clear sky' }],
            wind: { speed: 5 }
        };
        displayWeather(data);
        const weatherDiv = document.getElementById('weather').innerHTML;
        expect(weatherDiv).toContain('London');
        expect(weatherDiv).toContain('GB');
        expect(weatherDiv).toContain('20°C');
        expect(weatherDiv).toContain('clear sky');
        expect(weatherDiv).toContain('60%');
        expect(weatherDiv).toContain('5 m/s');
    });
});