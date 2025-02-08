// Required modules
const express = require('express');
const router = express.Router();
const WeatherAdapter = require('../adapters/weather/weather.js');

// Function to get the current weather
router.get('/', async (req, res) => {
    WeatherAdapter.getLocalWeather(req, res);
});

// Function to get the weather at a specific time (Unix time)
router.get('/timemachine', async (req, res) => {
    WeatherAdapter.getTimeWeather(req, res);
});

// Function to get the weather for a specific day (YYYY-MM-DD)
router.get('/day_summary', async (req, res) => {
    WeatherAdapter.getDayWeather(req, res);
});

// Function to get a weather map
router.get('/map', async (req, res) => {
    WeatherAdapter.getMap(req, res);
});

module.exports = router;    // Export the router for use in app.js