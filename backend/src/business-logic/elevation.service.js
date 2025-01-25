const ORS = require("../adapters/ors/ORS");
const ElevationCalculator = require("./elevation.extractor");

class ElevationService {
  async calculateElevation(start, end) {
    try {
      const route = await ORS.calculateRoute(start, end);

      const elevation = await ElevationCalculator.extractElevation(route);

      return elevation;
    } catch (error) {
      throw new Error("Error calculating route: " + error.message);
    }
  }
}

module.exports = new ElevationService();  // Esporta un'istanza del service
