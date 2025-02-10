const ORS = require("../adapters/ors/ORS"); // Importa il modulo per calcolare il percorso tramite ORS
const TrackCalculator = require("./track.calculator"); // Importa il modulo per calcolare i dettagli del percorso

class TrackService {
  // Metodo per calcolare il percorso a partire da un punto iniziale e finale
  async calculateTrack(start, end) {
    try {
      // Richiede al servizio ORS di calcolare la rotta tra i due punti
      const route = await ORS.calculateRoute(start, end);

      // Calcola i dettagli del percorso (dislivelli, distanza, ecc.) utilizzando TrackCalculator
      const track = await TrackCalculator.getTrack(route);

      // Restituisce i dati del percorso calcolato
      return track;
    } catch (error) {
      // Gestisce eventuali errori nella fase di calcolo del percorso
      throw new Error("Error calculating route: " + error.message);
    }
  }
}

module.exports = new TrackService(); // Esporta un'istanza della classe TrackService
