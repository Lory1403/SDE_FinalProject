const ElevationExtractor = require("./elevation.extractor");
const HeightDiffExtractor = require("./heightDiff.extractor"); // Importa il modulo correttamente

class TrackCalculator {
    async getTrack(route) {
        try {
            // Estrarre elevazione
            const elevation = await ElevationExtractor.extractElevation(route);

            if (!elevation || !elevation.geometry) {
                throw new Error("Elevation data is missing or invalid.");
            }

            // Calcola differenza di altezza
            const heightDiff = HeightDiffExtractor.extractHeightDiff(elevation.geometry);

            const summary = {
                distance: route.routes[0].summary.distance,
                duration: route.routes[0].summary.duration,
                heightDiff: heightDiff.heightDiff,
                up: heightDiff.up,
                down: heightDiff.down,
            };

            // Prepara il risultato finale
            const finalTrack = {
                summary: summary,
                geometry: elevation.geometry, // Usa direttamente la geometria dell'elevazione
            };

            return finalTrack;
        } catch (error) {
            throw new Error("Error calculating track: " + error.message);
        }
    }
}

module.exports = new TrackCalculator(); // Esporta un'istanza della classe
