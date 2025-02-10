const jwt = require("jsonwebtoken");
require("dotenv").config(); // Carica le variabili d'ambiente dal file .env

// Middleware per verificare l'autenticazione tramite JWT
const authChecker = async (req, res, next) => {
    // Estrae il token dall'intestazione "Authorization" (formato "Bearer <token>")
    const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

    if (token) {
        try {
            // Verifica il token utilizzando la chiave segreta definita nelle variabili d'ambiente
            const decoded = jwt.verify(token, process.env.SESSION_SECRET);
            
            // Aggiunge i dati decodificati dell'utente all'oggetto della richiesta
            req.user = decoded;

            return next(); // Passa al middleware successivo o al controller
        } catch (err) {
            // Gestisce i casi specifici di errore di verifica del token
            if (err.name === "TokenExpiredError") {
                // Il token è scaduto
                return res.status(401).json({ error: "Token scaduto" });
            }

            // Token non valido o altri errori di verifica
            return res.status(401).json({ error: "Token non valido" });
        }
    }

    // Nessun token fornito o header malformato
    res.status(401).json({ error: "Token mancante o non valido" });
};

module.exports = authChecker; // Esporta il middleware per essere utilizzato nelle route
