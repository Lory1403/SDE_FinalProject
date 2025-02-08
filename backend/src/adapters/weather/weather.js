// Required modules
require('dotenv').config();
const WeatherCalculator = require('../../business-logic/weather.calculator.js');

class WeatherAdapter {
    constructor() {
        // Define API base URLs
        this.baseWeatherAPI = 'https://api.openweathermap.org/data/3.0/onecall/overview?lat={lat}&lon={lon}&units=metric&appid={API key}';
        this.timeWeatherAPI = 'https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&units=metric&appid={API key}';
        this.dayWeatherAPI = 'https://api.openweathermap.org/data/3.0/onecall/day_summary?lat={lat}&lon={lon}&date={date}&units=metric&appid={API key}';
        this.mapWeatherAPI = 'https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={API key}';
    }

    // Function to make the API request
    async request(url) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('API response was not ok!');
            }

        const apiResponse = await response.json();
        // console.log('JSON response from API:\n', apiResponse);

            return apiResponse;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Function to get the current weather
    async getLocalWeather(req, res) {
        // Replace the placeholders in the URL with the actual values
        let getURL = this.baseWeatherAPI;
        getURL = getURL.replace('{API key}', process.env.OPEN_WEATHER_API);
        getURL = getURL.replace('{lat}', req.query.lat);
        getURL = getURL.replace('{lon}', req.query.lon);

        console.log("Url for API request --> %s", getURL);

        try {
            const apiResponse = await this.request(getURL);

            res.status(200).json(apiResponse); // Send the JSON response
        } catch (error) {
            console.error('Error:', error);
            res.status(500);
            res.setHeader('Content-Type', 'text/plain');
            res.send('500 - Internal Server Error');
        }
    }

    // Function to get the weather at a specific time (Unix time)
    async getTimeWeather(req, res) {
        // Replace the placeholders in the URL with the actual values
        let getURL = this.timeWeatherAPI;
        getURL = getURL.replace('{API key}', process.env.OPEN_WEATHER_API);
        getURL = getURL.replace('{lat}', req.query.lat);
        getURL = getURL.replace('{lon}', req.query.lon);
        getURL = getURL.replace('{time}', req.query.time);

        console.log("Url for API request --> %s", getURL);

        try {
            const apiResponse = await this.request(getURL);

            res.status(200).json(apiResponse); // Send the JSON response
        } catch (error) {
            console.error('Error:', error);
            res.status(500);
            res.setHeader('Content-Type', 'text/plain');
            res.send('500 - Internal Server Error');
        }
    }

    // Function to get the weather for a specific day (YYYY-MM-DD)
    async getDayWeather(req, res) {
        // Replace the placeholders in the URL with the actual values
        let getURL = this.dayWeatherAPI;
        getURL = getURL.replace('{API key}', process.env.OPEN_WEATHER_API);
        getURL = getURL.replace('{lat}', req.query.lat);
        getURL = getURL.replace('{lon}', req.query.lon);
        getURL = getURL.replace('{date}', req.query.date);

        console.log("Url for API request --> %s", getURL);

        try {
            const apiResponse = await this.request(getURL);

            res.status(200).json(apiResponse); // Send the JSON response
        } catch (error) {
            console.error('Error:', error);
            res.status(500);
            res.setHeader('Content-Type', 'text/plain');
            res.send('500 - Internal Server Error');
        }
    }

    // Function to get a weather map
    async getMap(req, res) {
        // Replace the placeholders in the URL with the actual values
        let getURL = this.mapWeatherAPI;
        getURL = getURL.replace('{API key}', process.env.OPEN_WEATHER_API);

        // Convert the map type to the correct format
        switch (req.query.map_type) {
            case "rain":
                req.query.map_type = "precipitation_new";
                break;
            case "wind":
                req.query.map_type = "wind_new";
                break;
            case "temperature":
                req.query.map_type = "temp_new";
                break;
            default:
                req.query.map_type = "precipitation_new";
                break;
        }

        getURL = getURL.replace('{layer}', req.query.map_type);
        getURL = getURL.replace('{z}', req.query.z);

        const { x, y } = WeatherCalculator.getTileCoordinates(req.query.lat, req.query.lon, req.query.z);

        getURL = getURL.replace('{x}', x);
        getURL = getURL.replace('{y}', y);

        console.log("Url for API request --> %s", getURL);

        try {
            const response = await fetch(getURL);

            if (!response.ok) {
                throw new Error('API response was not ok!');
            }

            const buffer = await response.arrayBuffer(); // Convert the image to a buffer

            console.log('Image has been retrieved successfully!');

            // Send received image
            res.status(200);
            res.setHeader('Content-Type', 'image/png');
            res.send(Buffer.from(buffer));
        } catch (error) {
            console.error('Error:', error);
            res.status(500);
            res.setHeader('Content-Type', 'text/plain');
            res.send('500 - Internal Server Error');
        }
    }
}

module.exports = new WeatherAdapter();  // Export an instance of the adapters