// Required modules
const express = require('express');
const router = express.Router();
require('dotenv').config();

// Define API base URLs
const coordinateAPI = 'https://api.geoapify.com/v1/geocode/reverse?lat={lat}&lon={lon}&apiKey={API key}';
const locationAPI = 'https://api.geoapify.com/v1/geocode/search?text={address}&apiKey={API key}';

// Function to make the API request
async function request(url) {
    try {
        const response = await fetch(url);

        if(!response.ok) {
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
router.get('/reverse', async (req, res) => {
    console.log(req.url);

    // Replace the placeholders in the URL with the actual values
    let getURL = coordinateAPI;
    getURL = getURL.replace('{API key}', process.env.GEOAPIFY_API);
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
router.get('/search', async (req, res) => {
    console.log(req.url);
    
    // Replace the placeholders in the URL with the actual values
    let getURL = locationAPI;
    getURL = getURL.replace('{API key}', process.env.GEOAPIFY_API);
    getURL = getURL.replace('{address}', req.query.text);
    
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

module.exports = router;    // Export the router for use in app.js