// Required modules
const express = require('express');
const router = express.Router();
const CoordinateAdapter = require('../adapters/location-extractor/coordinate.js');

// Function to get the current weather
router.get('/reverse', async (req, res) => {
    CoordinateAdapter.reverse(req, res);
});

// Function to get the weather at a specific time (Unix time)
router.get('/search', async (req, res) => {
    CoordinateAdapter.search(req, res);
});

module.exports = router;    // Export the router for use in app.js