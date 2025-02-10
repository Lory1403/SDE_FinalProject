// Required modules
const express = require('express');  // Importa il modulo Express per creare il server
const router = express.Router();  // Crea un nuovo router Express per gestire le rotte
const CoordinateAdapter = require('../adapters/location-extractor/coordinate.js');  // Importa l'adattatore per estrarre le coordinate

// Funzione per ottenere le coordinate inverse (ad esempio, da latitudine/longitudine a indirizzo)
router.get('/reverse', async (req, res) => {
    CoordinateAdapter.reverse(req, res);  // Chiamata al metodo reverse dell'adattatore per ottenere le coordinate inverse
});

// Funzione per ottenere il meteo in un momento specifico (passato, usando Unix time)
router.get('/search', async (req, res) => {
    CoordinateAdapter.search(req, res);  // Chiamata al metodo search dell'adattatore per ottenere il meteo in un momento specifico
});

// Esporta il router per poterlo utilizzare in altri file (come app.js)
module.exports = router;
