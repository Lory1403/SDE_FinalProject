const ORS = require("../adapters/ors/ORS");
const TrackCalculator = require("./track.calculator");
const DifficultyCalculator = require("./difficulty.calculator");

class DifficultyService {
  async calculateDifficulty(start, end) {
    try {
      const route = await ORS.calculateRoute(start, end);

      const track = await TrackCalculator.getTrack(route);

      const difficulty = await DifficultyCalculator.calculateDifficulty(track);

      return difficulty;
    } catch (error) {
      throw new Error("Error calculating route: " + error.message);
    }
  }
}

module.exports = new DifficultyService();  // Esporta un'istanza del service
