const User = require("../adapters/database/models/user.model");  // Importa il modello User per interagire con il database

// Funzione per ottenere un utente dal database utilizzando l'ID Google
const getUserByGoogleId = async (googleId) => {
  // Cerca l'utente nel database che ha il googleId specificato e restituisce il risultato come oggetto semplice (senza metodi del modello)
  return await User.findOne({ googleId }).lean();
};

// Esporta la funzione per poterla utilizzare in altri moduli
module.exports = {
  getUserByGoogleId,
};
