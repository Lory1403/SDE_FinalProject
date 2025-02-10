const ElevationExtractor = require("./elevation.extractor"); // Importa il modulo per estrarre l'elevazione
const HeightDiffExtractor = require("./heightDiff.extractor"); // Importa il modulo per calcolare le differenze di altezza

class TrackCalculator {
    // Metodo per calcolare le informazioni del percorso basate sulla rotta
    async getTrack(route) {
        try {
            // Estrarre i dati di elevazione dalla rotta
            const elevation = await ElevationExtractor.extractElevation(route);

            // Controlla se i dati di elevazione sono validi
            if (!elevation || !elevation.geometry) {
                throw new Error("Elevation data is missing or invalid.");
            }

            // Calcola le differenze di altezza (dislivelli) usando l'estrattore di altezza
            const heightDiff = HeightDiffExtractor.extractHeightDiff(elevation.geometry);

            // Crea un sommario del percorso con distanza, durata e dati di altezza
            const summary = {
                distance: route.routes[0].summary.distance, // Distanza totale del percorso
                duration: route.routes[0].summary.duration, // Durata stimata del percorso
                heightDiff: heightDiff.heightDiff,          // Differenza tra altitudine massima e minima
                up: heightDiff.up,                          // Totale dislivello in salita
                down: heightDiff.down,                      // Totale dislivello in discesa
            };

            // Prepara l'oggetto finale del percorso
            const finalTrack = {
                summary: summary,             // Sommario del percorso
                geometry: elevation.geometry, // Geometria associata al percorso
            };

            // Restituisce il percorso finale
            return finalTrack;
        } catch (error) {
            // Gestisce eventuali errori durante il calcolo del percorso
            throw new Error("Error calculating track: " + error.message);
        }
    }
}

module.exports = new TrackCalculator(); // Esporta un'istanza della classe TrackCalculator
