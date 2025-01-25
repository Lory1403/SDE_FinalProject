const polyline = require('@mapbox/polyline');

class CoordinatesExtractor{
    async extractCoordinates(route){
        try{
            const polylineString = route.routes[0].geometry;
            const coordinates = polyline.decode(polylineString);
            
            return coordinates;
        }catch(error){
            throw new Error("Error extracting coordinates: " + error.message);
        }
    }
}

module.exports = new CoordinatesExtractor();  // Esporta un'istanza del service