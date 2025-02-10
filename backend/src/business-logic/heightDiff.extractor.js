class HeightDiffExtractor {
    // Metodo per calcolare le differenze di altitudine, il dislivello totale in salita e in discesa
    extractHeightDiff(geometry) {
        // Se la geometria è vuota o non valida, restituisce zero per tutte le metriche
        if (!geometry || geometry.length === 0) {
            return {
                heightDiff: 0, // Differenza di altitudine massima e minima
                up: 0,         // Dislivello totale in salita
                down: 0        // Dislivello totale in discesa
            };
        }

        // Imposta i punti più basso e più alto come l'altitudine iniziale
        let lowestPoint = geometry.coordinates[0][2]; // Altitudine iniziale
        let highestPoint = geometry.coordinates[0][2];
        let up = 0;  // Totale salita
        let down = 0; // Totale discesa

        // Itera su tutti i punti della geometria
        for (let i = 1; i < geometry.coordinates.length; i++) {
            const currentElevation = geometry.coordinates[i][2]; // Elevazione del punto corrente
            const previousElevation = geometry.coordinates[i - 1][2]; // Elevazione del punto precedente

            // Aggiunge alla salita se l'elevazione corrente è maggiore della precedente
            if (currentElevation > previousElevation) {
                up += currentElevation - previousElevation;
            } 
            // Aggiunge alla discesa se l'elevazione corrente è minore della precedente
            else if (currentElevation < previousElevation) {
                down += previousElevation - currentElevation;
            }

            // Aggiorna il punto più basso e più alto se necessario
            lowestPoint = Math.min(lowestPoint, currentElevation);
            highestPoint = Math.max(highestPoint, currentElevation);
        }

        // Calcola la differenza di altitudine massima
        const heightDiff = highestPoint - lowestPoint;

        // Restituisce un oggetto con i risultati
        return {
            heightDiff, // Differenza tra punto più alto e più basso
            up,         // Dislivello totale in salita
            down        // Dislivello totale in discesa
        };
    }
}

module.exports = new HeightDiffExtractor(); // Esporta un'istanza della classe come servizio
