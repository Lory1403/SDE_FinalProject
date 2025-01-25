const ElevationExtractor = require("./elevation.extractor");

const ORS = require("../adapters/ors/ORS");

class TrackCalculator {
    async getTrack(route) {
        try{
            const elevation = await ElevationExtractor.extractElevation(route);

            const finalTrack = {
                summary: route.routes[0].summary,
                ...elevation.geometry,
            }  

            return finalTrack;
        } catch (error) {
            throw new Error("Error calculating track: " + error.message);
        }
    }
}

module.exports = new TrackCalculator();  // Esporta un'istanza del service