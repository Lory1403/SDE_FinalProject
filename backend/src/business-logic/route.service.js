const ORS = require("../adapters/ors/ORS");

class RouteService {
  async calculateRoute(start, end) {
    try {
      const route = await ORS.calculateRoute(start, end);
      return route;
    } catch (error) {
      throw new Error("Error calculating route: " + error.message);
    }
  }
}

module.exports = new RouteService();  // Esporta un'istanza del service
