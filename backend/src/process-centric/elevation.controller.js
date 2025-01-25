const ElevationService = require("../business-logic/elevation.service");  // Importa il service

class ElevationController {
  // Funzione per elaborare le coordinate e passare al service
  async getElevation(start, end) {
    try {
      // Funzione per validare e parsare le coordinate
      function parseCoordinates(coord) {
        const [lat, lng] = coord.split(',').map(Number);
        if (isNaN(lat) || isNaN(lng)) {
          throw new Error("Invalid coordinates format. Please provide coordinates as 'lat,lng'.");
        }
        return { lat, lng };
      }

      const parsedStart = parseCoordinates(start);
      const parsedEnd = parseCoordinates(end);

      // Passa i dati validati al service per calcolare il percorso
      const coordinates = await ElevationService.calculateElevation(parsedStart, parsedEnd);
      return coordinates;  // Restituisci il percorso calcolato
    } catch (error) {
      throw new Error("Error in processing coordinates: " + error.message);  // Gestisci eventuali errori
    }
  }
}

module.exports = new ElevationController();  // Esporta un'istanza del controller
