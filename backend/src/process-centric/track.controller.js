const express = require("express");  // Importa il modulo Express per creare il server
const router = express.Router();  // Crea un nuovo router per gestire le rotte
const TrackService = require("../business-logic/track.service");  // Importa il service per calcolare il percorso
const TrackData = require("../data-services/track.js");  // Importa il modulo per interagire con i dati dei percorsi

// Funzione per validare e parsare le coordinate
function parseCoordinates(coord) {
    const [lat, lng] = coord.split(',').map(Number);  // Converte la stringa delle coordinate in numeri
    if (isNaN(lat) || isNaN(lng)) {  // Verifica se le coordinate sono valide
        throw new Error("Invalid coordinates format. Please provide coordinates as 'lat,lng'.");
    }
    return { lat, lng };  // Restituisce un oggetto con latitudine e longitudine
}

// Gestisci la richiesta GET per calcolare il percorso
router.get("/", async (req, res) => {
    try {
        const { start, end } = req.query;  // Ottieni i parametri start e end dalla query string

        if (!start || !end) {  // Se mancano i parametri, rispondi con un errore
            return res.status(400).json({ message: "Start and end points are required." });
        }

        const parsedStart = parseCoordinates(start);  // Parsifica le coordinate di partenza
        const parsedEnd = parseCoordinates(end);  // Parsifica le coordinate di arrivo

        // Passa le coordinate al service per calcolare il percorso
        const track = await TrackService.calculateTrack(parsedStart, parsedEnd);
        res.status(200).json(track);  // Restituisci il percorso calcolato
    } catch (error) {
        res.status(500).json({ message: error.message });  // Gestisci gli errori con una risposta 500
    }
});

// Rotta per salvare un nuovo percorso
router.post("/save", async (req, res) => {
    try {
        const { track } = req.body;  // Ottieni i dati del percorso dal corpo della richiesta

        if (!track) {  // Se i dati del percorso sono mancanti, rispondi con un errore
            return res.status(400).json({ message: "Track data is required." });
        }

        const trackData = {  // Prepara i dati del percorso per il salvataggio
            track,
            googleId: req.user.googleId,  // Associa l'ID Google dell'utente
            timestamp: new Date()  // Aggiungi il timestamp corrente
        };

        // Salva il percorso nel database
        const savedTrack = await TrackData.saveTrack(trackData);

        res.status(201).json({ message: "Track saved successfully", track: savedTrack });  // Rispondi con il percorso salvato
    } catch (error) {
        res.status(500).json({ message: error.message });  // Gestisci gli errori con una risposta 500
    }
});

// Rotta per ottenere tutti i percorsi di un utente
router.get("/getTracks", async (req, res) => {
    try {
        const googleId = req.user.googleId;  // Ottieni l'ID Google dell'utente autenticato
        const userTracks = await TrackData.getUserTracks(googleId);  // Ottieni i percorsi salvati dall'utente
        res.status(200).json({ tracks: userTracks });  // Restituisci i percorsi dell'utente
    } catch (error) {
        res.status(500).json({ message: error.message });  // Gestisci gli errori con una risposta 500
    }
});

// Rotta per eliminare un percorso
router.delete("/deleteTrack", async (req, res) => {
    try {
        const googleId = req.user.googleId;  // Ottieni l'ID Google dell'utente autenticato
        const trackId = req.query.trackId;  // Ottieni l'ID del percorso da eliminare dalla query string
        const userTracks = await TrackData.deleteTrack(googleId, trackId);  // Elimina il percorso nel database
        res.status(200).json({ tracks: userTracks });  // Rispondi con la lista aggiornata dei percorsi dell'utente
    } catch (error) {
        res.status(500).json({ message: error.message });  // Gestisci gli errori con una risposta 500
    }
});

// Esporta il router per poterlo utilizzare in altri moduli (come app.js)
module.exports = router;
