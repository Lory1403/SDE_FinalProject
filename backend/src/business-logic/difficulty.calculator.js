class DifficultyCalculator {
    // Metodo per calcolare la difficoltà di un percorso basandosi su distanza e dislivello
    async calculateDifficulty(track) {
      const summary = track.summary; // Estrarre il riepilogo del percorso (distanza, dislivello)
  
      // Indice di difficoltà basato su distanza (in km) e dislivello (in metri)
      var cmpIdx = summary.distance / 1000 + (summary.up / 100);
  
      // Calcolo dell'indice CAI basato su dislivello e distanza
      var CAI = summary.up / 100 + summary.distance / 2000;
  
      // Classificazione del percorso in base a cmpIdx
      if (cmpIdx < 5) {
          cmpIdx = "Easy"; // Percorso facile
      } else if (cmpIdx < 10) {
          cmpIdx = "Medium"; // Percorso medio
      } else if (cmpIdx < 20) {
          cmpIdx = "Hard"; // Percorso difficile
      } else {
          cmpIdx = "Very hard"; // Percorso molto difficile
      }
  
      // Classificazione del percorso in base agli standard CAI
      if (CAI < 10) {
          CAI = "T1"; // Percorso turistico facile
      } else if (CAI < 20) {
          CAI = "T2"; // Percorso escursionistico
      } else if (CAI < 30) {
          CAI = "T3"; // Percorso impegnativo
      } else {
          CAI = "T4"; // Percorso difficile/tecnico
      }
  
      // Restituire un oggetto con i valori calcolati
      return { cmpIdx, CAI };
    }
  }
  
  module.exports = new DifficultyCalculator(); // Esportare un'istanza della classe
  