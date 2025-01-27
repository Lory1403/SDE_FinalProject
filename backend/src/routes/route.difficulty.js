const express = require("express");
const router = express.Router();  // Definisci il router
const TrackController = require("../process-centric/difficulty.controller");  // Importa il controller

// Gestisci la richiesta GET per calcolare il percorso
router.get("/", async (req, res) => {
  try {
    const { start, end } = req.query;  // Ottieni le coordinate dalla query string

    // Verifica se i parametri start e end sono presenti
    if (!start || !end) {
      return res.status(400).json({ message: "Start and end points are required." });
    }

    // Passa i parametri al controller
    const track = await TrackController.getTrack(start, end);
    res.status(200).json(track);  // Restituisci il percorso calcolato
  } catch (error) {
    res.status(500).json({ message: error.message });  // Gestisci gli errori
  }
});

module.exports = router;  // Esporta il router
