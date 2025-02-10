const express = require('express');  // Importa il modulo Express
const router = express.Router();  // Crea un nuovo router Express per gestire le rotte
const GoogleAdapter = require('../adapters/auth/oauth');  // Importa il modulo per l'autenticazione con Google
const userEncrypt = require('../business-logic/userEncrypt.service');  // Importa il modulo per la crittografia dei dati utente
const authChecker = require('../adapters/auth/authChecker');  // Importa il middleware per verificare l'autenticazione dell'utente

// Rotta per il login con Google
router.get("/", async (req, res) => {
    GoogleAdapter.login(req, res);  // Avvia il processo di login con Google
});

// Rotta di callback che Google invia dopo l'autenticazione
router.get("/callback", async (req, res) => {
    GoogleAdapter.callback(req, res);  // Gestisce la risposta di Google dopo il login
});

// Rotta per ottenere i dati utente, protetta con il middleware di autenticazione
router.get("/user", authChecker, async (req, res) => {
    try {
        // Ottiene i dati utente crittografati utilizzando l'ID Google dell'utente
        const encryptedData = await userEncrypt.getUserData(req.user.googleId);
        
        // Restituisce i dati crittografati come risposta
        res.send({ encryptedData });
    } catch (error) {
        // Se c'è un errore, logga e restituisce un errore al client
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Esporta il router per poterlo utilizzare nell'app Express
module.exports = router;
