const jwt = require("jsonwebtoken");
require("dotenv").config();

const authChecker = async (req, res, next) => {
    // Verifica JWT se presente nelle intestazioni Authorization
    const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1]; // "Bearer <token>"

    if (token) {
        try {
            // Verifica la validità del token e la sua scadenza
            jwt.verify(token, process.env.SESSION_SECRET);

            return next(); // Token valido, prosegui con la richiesta
        } catch (err) {
            // Controlla se l'errore è dovuto alla scadenza del token
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ error: "Token scaduto" });
            }

            // Altri errori (ad esempio token mancante o non valido)
            return res.status(401).json({ error: "Token non valido" });
        }
    }

    // Se non c'è il token JWT valido, restituiamo un errore
    res.status(401).json({ error: "Token mancante o non valido" });
};

module.exports = authChecker;
