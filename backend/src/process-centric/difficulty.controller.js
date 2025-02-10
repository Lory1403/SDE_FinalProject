const express = require("express");  // Importa il modulo Express per creare il server
const router = express.Router();  // Definisce un nuovo router per gestire le rotte

// Importa il service per calcolare la difficoltà del percorso
const TrackService = require("../business-logic/difficulty.service");  

// Gestisci la richiesta GET per calcolare la difficoltà del percorso
router.get("/", async (req, res) => {
  try {
    // Funzione per validare e parsare le coordinate
    function parseCoordinates(coord) {
      const [lat, lng] = coord.split(',').map(Number);  // Converte la stringa delle coordinate in numeri
      if (isNaN(lat) || isNaN(lng)) {  // Verifica se le coordinate sono valide
        throw new Error("Invalid coordinates format. Please provide coordinates as 'lat,lng'.");
      }
      return { lat, lng };  // Restituisce un oggetto con latitudine e longitudine
    }

    const { start, end } = req.query;  // Ottieni le coordinate di partenza e arrivo dalla query string

    // Verifica se i parametri start e end sono presenti
    if (!start || !end) {
      return res.status(400).json({ message: "Start and end points are required." });  // Risponde con errore se mancano i parametri
    }

    // Parsifica le coordinate di partenza e arrivo
    const parsedStart = parseCoordinates(start);
    const parsedEnd = parseCoordinates(end);

    // Passa i dati validati al service per calcolare la difficoltà del percorso
    const track = await TrackService.calculateDifficulty(parsedStart, parsedEnd);

    // Restituisce il percorso calcolato
    res.status(200).json(track);  
  } catch (error) {
    // Gestione degli errori, risponde con il messaggio di errore
    res.status(500).json({ message: "Error in processing coordinates: " + error.message });
  }
});

// Esporta il router per poterlo utilizzare in altri moduli (come app.js)
module.exports = router;
