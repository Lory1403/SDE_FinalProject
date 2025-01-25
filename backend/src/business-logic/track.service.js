const ORS = require("../adapters/ors/ORS");
const TrackCalculator = require("./track.calculator");

class TrackService {
  async calculateTrack(start, end) {
    try {
      const route = await ORS.calculateRoute(start, end);

      const track = await TrackCalculator.getTrack(route);

      return track;
    } catch (error) {
      throw new Error("Error calculating route: " + error.message);
    }
  }
}

module.exports = new TrackService();  // Esporta un'istanza del service
