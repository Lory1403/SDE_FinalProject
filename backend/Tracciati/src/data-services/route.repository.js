const Route = require("../adapters/database/models/route.model");

class RouteRepository {
  async findRoute(start, end) {
    return await Route.findOne({ start, end });
  }

  async createRoute(routeData) {
    return await Route.create(routeData);
  }

  async getAllRoutes() {
    return await Route.find();
  }
}

module.exports = new RouteRepository();
