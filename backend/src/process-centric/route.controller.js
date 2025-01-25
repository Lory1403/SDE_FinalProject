const RouteService = require("../business-logic/route.service");  // Importa il service

class RouteController {
  // Funzione per elaborare le coordinate e passare al service
  async getRoute(start, end) {
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
      const route = await RouteService.calculateRoute(parsedStart, parsedEnd);
      return route;  // Restituisce il percorso calcolato
    } catch (error) {
      throw new Error("Error in processing coordinates: " + error.message);  // Gestisci eventuali errori
    }
  }
}

module.exports = new RouteController();  // Esporta un'istanza del controller
