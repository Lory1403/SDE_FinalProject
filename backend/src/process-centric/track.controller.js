const express = require("express");
const router = express.Router();
const TrackService = require("../business-logic/track.service");

// Funzione per validare e parsare le coordinate
function parseCoordinates(coord) {
    const [lat, lng] = coord.split(',').map(Number);
    if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid coordinates format. Please provide coordinates as 'lat,lng'.");
    }
    return { lat, lng };
}

// Gestisci la richiesta GET per calcolare il percorso
router.get("/", async (req, res) => {
    try {
        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({ message: "Start and end points are required." });
        }

        const parsedStart = parseCoordinates(start);
        const parsedEnd = parseCoordinates(end);

        const track = await TrackService.calculateTrack(parsedStart, parsedEnd);
        res.status(200).json(track);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
