require("dotenv").config();
const express = require("express");
const routeRoutes = require("./routes/route.routes");  // Importa il router delle rotte

const app = express();

// Middleware per il parsing delle richieste in formato JSON
app.use(express.json());

// Usa il router per gestire le richieste a /api/routes
app.use("/api/routes", routeRoutes);  // Aggiungi il prefisso /api/routes

module.exports = app;
