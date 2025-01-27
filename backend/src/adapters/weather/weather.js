// Required modules
const express = require('express');
const router = express.Router();
require('dotenv').config();

/* TEST URLs
http://127.0.0.1:8080/api/weather?lat=45.552929&lon=10.778730
http://127.0.0.1:8080/api/weather/timemachine?lat=45.552929&lon=10.778730&time=1737965547
http://127.0.0.1:8080/api/weather/day_summary?lat=45.552929&lon=10.778730&date=2025-01-27

Weather map
http://127.0.0.1:8080/api/weather/map?map_type=rain&z=7&x=0&y=0 --> z=zoom, x=longitude, y=latitude

https://www.unixtimestamp.com/ --> For Unix time conversion
*/

// Define API base URLs
const baseWeatherAPI = 'https://api.openweathermap.org/data/3.0/onecall/overview?lat={lat}&lon={lon}&units=metric&appid={API key}';
const timeWeatherAPI = 'https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&units=metric&appid={API key}';
const dayWeatherAPI = 'https://api.openweathermap.org/data/3.0/onecall/day_summary?lat={lat}&lon={lon}&date={date}&units=metric&appid={API key}';
const mapWeatherAPI = 'https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={API key}';

// Function to make the API request
async function request(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('API response was not ok!');
        }

        const apiResponse = await response.json();
        console.log('JSON response from API:\n', apiResponse);

        return apiResponse;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Function to get the current weather
router.get('/', async (req, res) => {
    console.log(req.url);

    // Replace the placeholders in the URL with the actual values
    let getURL = baseWeatherAPI;
    getURL = getURL.replace('{API key}', process.env.OPEN_WEATHER_API);
    getURL = getURL.replace('{lat}', req.query.lat);
    getURL = getURL.replace('{lon}', req.query.lon);

    console.log("Url for API request --> %s", getURL);

    try {
        const apiResponse = await request(getURL);

        res.status(200).json(apiResponse); // Send the JSON response
    } catch (error) {
        console.error('Error:', error);
        res.status(500);
        res.setHeader('Content-Type', 'text/plain');
        res.send('500 - Internal Server Error');
    }
});

// Function to get the weather at a specific time (Unix time)
router.get('/timemachine', async (req, res) => {
    console.log(req.url);

    // Replace the placeholders in the URL with the actual values
    let getURL = timeWeatherAPI;
    getURL = getURL.replace('{API key}', process.env.OPEN_WEATHER_API);
    getURL = getURL.replace('{lat}', req.query.lat);
    getURL = getURL.replace('{lon}', req.query.lon);
    getURL = getURL.replace('{time}', req.query.time);

    console.log("Url for API request --> %s", getURL);

    try {
        const apiResponse = await request(getURL);

        res.status(200).json(apiResponse); // Send the JSON response
    } catch (error) {
        console.error('Error:', error);
        res.status(500);
        res.setHeader('Content-Type', 'text/plain');
        res.send('500 - Internal Server Error');
    }
});

// Function to get the weather for a specific day (YYYY-MM-DD)
router.get('/day_summary', async (req, res) => {
    console.log(req.url);

    // Replace the placeholders in the URL with the actual values
    let getURL = dayWeatherAPI;
    getURL = getURL.replace('{API key}', process.env.OPEN_WEATHER_API);
    getURL = getURL.replace('{lat}', req.query.lat);
    getURL = getURL.replace('{lon}', req.query.lon);
    getURL = getURL.replace('{date}', req.query.date);

    console.log("Url for API request --> %s", getURL);

    try {
        const apiResponse = await request(getURL);

        res.status(200).json(apiResponse); // Send the JSON response
    } catch (error) {
        console.error('Error:', error);
        res.status(500);
        res.setHeader('Content-Type', 'text/plain');
        res.send('500 - Internal Server Error');
    }
});

function getTileCoordinates(lat, lon, zoom) {
    const x = (Math.floor((lon+180)/360*Math.pow(2,zoom)));
    const y = (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
    return { x, y };
}

// Function to get a weather map
router.get('/map', async (req, res) => {
    console.log(req.url);

    // Replace the placeholders in the URL with the actual values
    let getURL = mapWeatherAPI;
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

    const { x, y } = getTileCoordinates(req.query.lat, req.query.lon, req.query.z);

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
});

module.exports = router;    // Export the router for use in app.js