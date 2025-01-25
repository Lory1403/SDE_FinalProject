const ORS = require("../adapters/ors/ORS");

class ElevationCalculator {
    async extractElevation(route) {
        try{
            const polylineString = route.routes[0].geometry;

            const elevation = await ORS.calculateElevation(polylineString);

            return elevation;
        } catch (error) {
            throw new Error("Error extracting elevation: " + error.message);
        }
    }
}

module.exports = new ElevationCalculator();  // Esporta un'istanza del service