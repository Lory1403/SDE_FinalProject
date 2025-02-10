const ORS = require("../adapters/ors/ORS"); // Importa l'adattatore per OpenRouteService (ORS)

class ElevationCalculator {
    // Metodo per estrarre i dati di elevazione da un percorso
    async extractElevation(route) {
        try {
            // Estrae la geometria del percorso dalla risposta
            const polylineString = route.routes[0].geometry;

            // Calcola l'elevazione utilizzando il servizio ORS e la geometria del percorso
            const elevation = await ORS.calculateElevation(polylineString);

            // Restituisce i dati di elevazione calcolati
            return elevation;
        } catch (error) {
            // Gestisce eventuali errori e lancia un'eccezione con un messaggio dettagliato
            throw new Error("Error extracting elevation: " + error.message);
        }
    }
}

module.exports = new ElevationCalculator(); // Esporta un'istanza della classe come servizio
