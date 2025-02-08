// var osmtogeojson = require('osmtogeojson');
const proj4 = require('proj4');

class CoordinatesConverter {
    constructor() {
        this.epsg4326 = "EPSG:4326"; // WGS84 (lat/lon)
        this.epsg3857 = "EPSG:3857"; // Web Mercator
    }

    fromEpsg4326toEpsg3857(lat, lon) {
        return proj4(this.epsg4326, this.epsg3857, [lon, lat]);
    }
    
    fromEpsg3857toEpsg4326(x, y) {
        return proj4(this.epsg3857, this.epsg4326, [x, y]);
    }
}

module.exports = new CoordinatesConverter();    // Export an instance of the class