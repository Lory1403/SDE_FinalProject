const axios = require("axios");  // Usa Axios per fare richieste HTTP
const e = require("express");

require('dotenv').config({ path: '../../.env' });

class ORS {
  async calculateRoute(start, end) {
    try {
      // Corpo della richiesta per OpenRouteService (personalizza le coordinate e il token)
      const body = JSON.stringify({
        coordinates: [[start.lng, start.lat], [end.lng, end.lat]],
        profileName: "foot-walking",
      });

      // Invia la richiesta a OpenRouteService
      const response = await axios.post("https://api.openrouteservice.org/v2/directions/foot-hiking/json", body, {
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

  async calculateElevation(polyline) {
    try{
        // Corpo della richiesta per OpenRouteService (personalizza le coordinate e il token)
        const body = JSON.stringify({
          format_in: "encodedpolyline5",
          geometry: polyline,
        });

        // Invia la richiesta a OpenRouteService
        const response = await axios.post("https://api.openrouteservice.org/elevation/line", body, {
          headers: {
            "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
            "Content-Type": "application/json",
            "Authorization": process.env.ORS_TOKEN,  // Usa il token OpenRouteService
          },
        });

        return response.data;  // Restituisci il percorso calcolato
    } catch (error) {
      throw new Error("Error calculating elevation: " + error.message);  // Gestisci gli errori di calcolo
    }
  }
}

module.exports = new ORS();  // Esporta un'istanza del service