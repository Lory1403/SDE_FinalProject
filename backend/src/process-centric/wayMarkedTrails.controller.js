const express = require("express");  // Importa il modulo Express per creare il server
const router = express.Router();  // Crea un nuovo router per gestire le rotte
const WayMarkedTrailsAdapter = require("../adapters/wayMarkedTrails/wayMarkedTrails.js");  // Importa l'adapter per le rotte dei sentieri

// Rotta per convertire coordinate da EPSG:4326 a EPSG:3857
router.get("/fromEpsg4326toEpsg3857", async (req, res) => {
    WayMarkedTrailsAdapter.fromEpsg4326toEpsg3857(req, res);  // Chiama la funzione per la conversione delle coordinate
});

// Rotta per convertire coordinate da EPSG:3857 a EPSG:4326
router.get("/fromEpsg3857toEpsg4326", async (req, res) => {
    WayMarkedTrailsAdapter.fromEpsg3857toEpsg4326(req, res);  // Chiama la funzione per la conversione delle coordinate
});

// Rotta per ottenere i sentieri cliccando su una posizione
router.get("/trailsByClick", async (req, res) => {
    WayMarkedTrailsAdapter.getTrailsByClick(req, res);  // Chiama la funzione per ottenere i sentieri in base alla posizione cliccata
});

// Rotta per ottenere un sentiero specifico tramite ID
router.get("/trailById", async (req, res) => {
    WayMarkedTrailsAdapter.getTrailById(req, res);  // Chiama la funzione per ottenere un sentiero con un dato ID
});

// Rotta per ottenere l'elevazione di un sentiero
router.get("/trailElevation", async (req, res) => {
    WayMarkedTrailsAdapter.getTrailElevation(req, res);  // Chiama la funzione per ottenere l'elevazione di un sentiero
});

// Rotta per evidenziare un sentiero specifico
router.get("/highlightTrail", async (req, res) => {
    WayMarkedTrailsAdapter.getHighlightTrail(req, res);  // Chiama la funzione per evidenziare un sentiero
});

// Esporta il router per poterlo utilizzare in altri moduli (come app.js)
module.exports = router;
