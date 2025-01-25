require('dotenv').config({ path: '../.env' });
const express = require('express');
const session = require("express-session");
const app = express();
const port = process.env.PORT;

const cors = require('cors');

const oauth = require('./src/adapters/auth/oauth.js');
const authChecker = require('./src/adapters/auth/authChecker.js');

const routeTrack = require('./src/routes/route.track.js');

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

// Session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: process.env.NODE_ENV === "production" },
    })
);

// Frontend
// app.use('/', express.static('../frontend/dist'));

app.use(cors());

// app.use(cors({
//     origin: 'http://localhost:' + port,
// }));

// Google OAuth
app.use('/auth/google', oauth);

//app.use("/api/routes", authChecker, routeRoutes);  // Aggiungi il prefisso /api/routes
app.use("/api/track", routeTrack);  // Aggiungi il prefisso /api/elevation

// API
// Dashboard (accessibile solo agli utenti autenticati)
app.get("/", authChecker, (req, res) => {
    res.send(
        `<h1>Dashboard</h1><p>Benvenuto, ${req.session.userInfo.name}</p><a href="/logout">Logout</a>`
    );
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/"); // Reindirizza alla homepage
    });
});

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: "Not found" });
});

module.exports = app;