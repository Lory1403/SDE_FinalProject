const express = require("express");
const router = express.Router();  // Definisci il router
//const TrackController = require("../process-centric/difficulty.controller");  // Importa il controller
const TrackService = require("../business-logic/difficulty.service");  // Importa il service

// Gestisci la richiesta GET per calcolare il percorso
router.get("/", async (req, res) => {
  try {
    // Funzione per validare e parsare le coordinate
    function parseCoordinates(coord) {
      const [lat, lng] = coord.split(',').map(Number);
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid coordinates format. Please provide coordinates as 'lat,lng'.");
      }
      return { lat, lng };
    }

    const { start, end } = req.query;  // Ottieni le coordinate dalla query string

    // Verifica se i parametri start e end sono presenti
    if (!start || !end) {
      return res.status(400).json({ message: "Start and end points are required." });
    }

    const parsedStart = parseCoordinates(start);
    const parsedEnd = parseCoordinates(end);

    // Passa i dati validati al service per calcolare il percorso
    const track = await TrackService.calculateDifficulty(parsedStart, parsedEnd);
    res.status(200).json(track);  // Restituisci il percorso calcolato
  } catch (error) {
    res.status(500).json({ message: "Error in processing coordinates: " + error.message });  // Gestisci gli errori
  }
});

module.exports = router;  // Esporta il router
