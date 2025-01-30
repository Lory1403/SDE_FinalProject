require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express();
const port = process.env.PORT;

const cors = require('cors');

// Import Javascript files
const oauth = require('./src/adapters/auth/oauth.js');
const authChecker = require('./src/adapters/auth/authChecker.js');
const weather = require('./src/adapters/weather/weather.js');
const routeTrack = require('./src/routes/route.track.js');
const location = require('./src/adapters/location-extractor/coordinate.js');
const difficulty = require('./src/routes/route.difficulty.js');
const wayMarkedTrails = require('./src/adapters/wayMarkedTrails/wayMarkedTrails.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(req.method + " " + req.url);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-access-token');
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next();
});

// Frontend
// app.use('/', express.static('../frontend/dist'));

app.use(cors());

// app.use(cors({
//     origin: 'http://localhost:' + port,
// }));

// Google OAuth
app.use('/auth/google', oauth);

app.use("/api/track", routeTrack);  // Aggiungi il prefisso /api/elevation

app.use("/api/difficulty", difficulty);  // Aggiungi il prefisso /api/difficulty

// Use the weather route
app.use('/api/weather', weather);

// Use the location-extractor route
app.use('/api/location', location);

app.use('/api/wayMarkedTrails', wayMarkedTrails);

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: "Not found" });
});

module.exports = app;