require('dotenv').config({ path: '../.env' });  // Carica le variabili di ambiente dal file .env situato al livello superiore
const express = require('express');
const app = express();  // Crea un'applicazione Express

const cors = require('cors');  // Importa il modulo CORS per gestire le richieste da domini esterni

// Importa i file JavaScript che gestiscono la logica dell'autenticazione, delle API e delle funzionalità
const oauth = require('./src/process-centric/authentication.controller.js');
const authChecker = require('./src/adapters/auth/authChecker.js');
const weather = require('./src/process-centric/weather.controller.js');
const routeTrack = require('./src/process-centric/track.controller.js');
const location = require('./src/process-centric/coordinate.controller.js');
const difficulty = require('./src/process-centric/difficulty.controller.js');
const wayMarkedTrails = require('./src/process-centric/wayMarkedTrails.controller.js');

// Middleware per il parsing di JSON e URL encoded nelle richieste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware per il logging delle richieste e per la configurazione CORS
app.use((req, res, next) => {
    console.log(req.method + " " + req.url);  // Logga il metodo HTTP e l'URL della richiesta
    res.setHeader('Access-Control-Allow-Origin', '*');  // Permette richieste da qualsiasi dominio
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');  // Permette determinati metodi HTTP
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-access-token');  // Permette determinati header
    res.setHeader('Access-Control-Allow-Credentials', 'true');  // Permette l'invio di credenziali
    next();  // Passa il controllo al prossimo middleware
});

app.use(cors());  // Abilita CORS per tutte le richieste

// Rute per l'autenticazione tramite Google OAuth
app.use('/auth/google', oauth);

// Rute protette da autenticazione per la gestione dei percorsi, della difficoltà, del meteo, e altre funzionalità
app.use('/api/track', authChecker, routeTrack);
app.use('/api/difficulty', authChecker, difficulty);
app.use('/api/weather', authChecker, weather);
app.use('/api/location', authChecker, location);
app.use('/api/wayMarkedTrails', authChecker, wayMarkedTrails);

// Handler per la gestione di richieste a URL non trovati (errore 404)
app.use((req, res) => {
    res.status(404);  // Imposta il codice di stato HTTP a 404 (Not Found)
    res.json({ error: "Not found" });  // Restituisce un messaggio di errore in formato JSON
});

module.exports = app;  // Esporta l'applicazione Express per l'utilizzo in altri moduli
