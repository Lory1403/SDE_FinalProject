const ORS = require("../adapters/ors/ORS");
const CoordinatesExtractor = require("./coordinates.extractor");

class RouteService {
  async calculateRoute(start, end) {
    try {
      const route = await ORS.calculateRoute(start, end);

      const coordinates = await CoordinatesExtractor.extractCoordinates(route);

      return coordinates;
    } catch (error) {
      throw new Error("Error calculating route: " + error.message);
    }
  }
}

module.exports = new RouteService();  // Esporta un'istanza del service
