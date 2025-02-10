const proj4 = require('proj4');  // Importa il modulo proj4 per la proiezione delle coordinate geografiche

class CoordinatesConverter {
    constructor() {
        this.epsg4326 = "EPSG:4326"; // WGS84 (lat/lon) - Sistema di coordinate geografiche che rappresentano latitudine e longitudine
        this.epsg3857 = "EPSG:3857"; // Web Mercator - Sistema di coordinate comunemente utilizzato per mappe web (coordinate in metri)
    }

    // Funzione per convertire le coordinate da EPSG:4326 (lat, lon) a EPSG:3857 (x, y)
    fromEpsg4326toEpsg3857(lat, lon) {
        return proj4(this.epsg4326, this.epsg3857, [lon, lat]);  // Usa proj4 per convertire da EPSG:4326 a EPSG:3857
    }
    
    // Funzione per convertire le coordinate da EPSG:3857 (x, y) a EPSG:4326 (lat, lon)
    fromEpsg3857toEpsg4326(x, y) {
        return proj4(this.epsg3857, this.epsg4326, [x, y]);  // Usa proj4 per convertire da EPSG:3857 a EPSG:4326
    }
}

// Esporta un'istanza della classe CoordinatesConverter, rendendola disponibile per altri moduli
module.exports = new CoordinatesConverter();
