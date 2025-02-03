const jwt = require("jsonwebtoken");
require("dotenv").config();

const authChecker = async (req, res, next) => {
    const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SESSION_SECRET);
            req.user = decoded; // Aggiungi i dati decodificati alla richiesta

            return next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ error: "Token scaduto" });
            }

            return res.status(401).json({ error: "Token non valido" });
        }
    }

    res.status(401).json({ error: "Token mancante o non valido" });
};

module.exports = authChecker;