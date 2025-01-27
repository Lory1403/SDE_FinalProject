class HeightDiffExtractor {
    extractHeightDiff(geometry) {
        if (!geometry || geometry.length === 0) {
            return {
                heightDiff: 0,
                up: 0,
                down: 0
            };
        }

        let lowestPoint = geometry.coordinates[0][2]; // Altitudine iniziale
        let highestPoint = geometry.coordinates[0][2];
        let up = 0;
        let down = 0;

        // Itera su tutti i punti della geometria
        for (let i = 1; i < geometry.coordinates.length; i++) {
            const currentElevation = geometry.coordinates[i][2]; // Elevazione del punto corrente
            const previousElevation = geometry.coordinates[i - 1][2]; // Elevazione del punto precedente

            if (currentElevation > previousElevation) {
                up += currentElevation - previousElevation;
            } else if (currentElevation < previousElevation) {
                down += previousElevation - currentElevation;
            }

            lowestPoint = Math.min(lowestPoint, currentElevation);
            highestPoint = Math.max(highestPoint, currentElevation);
        }

        const heightDiff = highestPoint - lowestPoint;

        return {
            heightDiff,
            up,
            down
        };
    }
}

module.exports = new HeightDiffExtractor();
