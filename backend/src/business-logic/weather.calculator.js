class WeatherCalculator {
    // Metodo per ottenere le coordinate del tile (mappa) a partire dalle coordinate geografiche e dal livello di zoom
    getTileCoordinates(lat, lon, zoom) {
        // Calcola la coordinata X del tile
        const x = (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
        
        // Calcola la coordinata Y del tile, usando la formula per la proiezione Mercatore inversa
        const y = (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
        
        // Restituisce un oggetto con le coordinate x e y del tile
        return { x, y };
    }
}

// Esporta un'istanza della classe WeatherCalculator, così che possa essere utilizzata altrove
module.exports = new WeatherCalculator();
