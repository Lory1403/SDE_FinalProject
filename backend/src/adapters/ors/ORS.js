const axios = require("axios");  // Usa Axios per fare richieste HTTP
const e = require("express");

class ORS {
  async calculateRoute(start, end) {
    try {
      // Corpo della richiesta per OpenRouteService (personalizza le coordinate e il token)
      const body = JSON.stringify({
        coordinates: [[start.lng, start.lat], [end.lng, end.lat]],
        profileName: "foot-walking",
      });

      // Invia la richiesta a OpenRouteService
      const response = await axios.post("https://api.openrouteservice.org/v2/directions/foot-hiking", body, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": process.env.ORS_TOKEN,  // Usa il token OpenRouteService
        },
      });

      return response.data;  // Restituisci il percorso calcolato
    } catch (error) {
      throw new Error("Error calculating route: " + error.message);  // Gestisci gli errori di calcolo
    }
  }
}

module.exports = new ORS();  // Esporta un'istanza del service