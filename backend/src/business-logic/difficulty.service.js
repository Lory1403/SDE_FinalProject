const ORS = require("../adapters/ors/ORS"); // Importa l'adattatore per il servizio di routing (ORS)
const TrackCalculator = require("./track.calculator"); // Importa il calcolatore di tracce
const DifficultyCalculator = require("./difficulty.calculator"); // Importa il calcolatore di difficoltà

class DifficultyService {
  // Metodo per calcolare la difficoltà di un percorso dati il punto di partenza e arrivo
  async calculateDifficulty(start, end) {
    try {
      // Calcola il percorso tra i punti di partenza e arrivo utilizzando ORS
      const route = await ORS.calculateRoute(start, end);

      // Calcola i dettagli del percorso (traccia) usando il TrackCalculator
      const track = await TrackCalculator.getTrack(route);

      // Determina la difficoltà del percorso basandosi sui dettagli della traccia
      const difficulty = await DifficultyCalculator.calculateDifficulty(track);

      // Restituisce la difficoltà calcolata
      return difficulty;
    } catch (error) {
      // Gestisce eventuali errori durante il calcolo e lancia un'eccezione con un messaggio dettagliato
      throw new Error("Error calculating route: " + error.message);
    }
  }
}

module.exports = new DifficultyService(); // Esporta un'istanza della classe come servizio
