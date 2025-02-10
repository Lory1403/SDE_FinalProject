const userService = require("../data-services/user");  // Importa il servizio utente
const aesjs = require('aes-js');  // Importa la libreria per la crittografia AES

// Funzione asincrona per ottenere e criptare i dati dell'utente
const getUserData = async (googleId) => {
  // Recupera l'utente dal database utilizzando l'ID di Google
  const user = await userService.getUserByGoogleId(googleId);

  // Se l'utente non viene trovato, lancia un errore
  if (!user) {
    throw new Error("User not found");
  }

  // Crittografa i dati dell'utente e restituisce il risultato
  const encryptedData = encryptData(JSON.stringify(user));  
  return encryptedData;
};

// Funzione per crittografare i dati
function encryptData(data) {
  // Converte i dati in un array di byte (UTF-8)
  const textBytes = aesjs.utils.utf8.toBytes(data);

  // Crea un'istanza del cifrario AES in modalità CTR con la chiave di crittografia
  const aesCtr = new aesjs.ModeOfOperation.ctr(aesjs.utils.utf8.toBytes(process.env.ENCRYPTION_KEY));

  // Crittografa i dati e restituisce il risultato in formato esadecimale
  const encryptedBytes = aesCtr.encrypt(textBytes);
  return aesjs.utils.hex.fromBytes(encryptedBytes);
}

module.exports = {
  getUserData,  // Esporta la funzione per ottenere i dati crittografati dell'utente
};
