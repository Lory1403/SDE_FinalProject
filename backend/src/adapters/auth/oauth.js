const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../database/models/user.model");

require("dotenv").config(); // Carica le variabili d'ambiente definite nel file .env

// Definisce gli scope di autorizzazione richiesti per Google OAuth
const GOOGLE_OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

class GoogleAdapter {
  // Metodo per iniziare il flusso di login con Google OAuth
  async login(req, res) {
    const scopes = GOOGLE_OAUTH_SCOPES.join(" "); // Unisce gli scope in una stringa separata da spazi
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${process.env.GOOGLE_OAUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&scope=${encodeURIComponent(scopes)}`;
    res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL); // Reindirizza l'utente alla schermata di consenso di Google
  }

  // Metodo per gestire la callback di Google OAuth
  async callback(req, res) {
    const { code, state, error } = req.query; // Estrae i parametri dalla query string

    if (error) {
      // L'utente ha negato il consenso
      return res.status(400).json({ error: "User denied consent" });
    }

    if (!code) {
      // Mancanza del codice di autorizzazione
      return res.status(400).json({ error: "Authorization code missing" });
    }

    try {
      // Prepara i dati per richiedere il token di accesso
      const data = new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      });

      // Effettua una richiesta per ottenere il token di accesso
      const tokenResponse = await fetch(process.env.GOOGLE_ACCESS_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data,
      });

      if (!tokenResponse.ok) {
        // Gestione degli errori di risposta
        const errorText = await tokenResponse.text();
        return res.status(tokenResponse.status).json({
          error: "Failed to fetch access token",
          details: errorText,
        });
      }

      const tokenData = await tokenResponse.json(); // Analizza la risposta JSON
      const { id_token } = tokenData; // Estrae l'id_token dalla risposta

      // Ottiene informazioni sull'utente utilizzando l'id_token
      const userInfoResponse = await fetch(`${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`);
      const userInfo = await userInfoResponse.json();

      // Crea il payload per il token JWT
      const payload = {
        googleId: userInfo.sub, // ID univoco dell'utente fornito da Google
        iat: Number(userInfo.iat), // Timestamp di creazione del token
      };

      // Opzioni per il token JWT
      const options = {
        expiresIn: 3600, // Scadenza in un'ora
      };

      const jwtToken = jwt.sign(payload, process.env.SESSION_SECRET, options); // Genera il token JWT

      // Verifica se l'utente esiste già nel database
      const existingUser = await User.findOne({ googleId: userInfo.sub });
      if (!existingUser) {
        // Salva un nuovo utente se non esiste
        const newUser = new User({
          email: userInfo.email,
          name: userInfo.name,
          googleId: userInfo.sub,
        });
        await newUser.save();
      }

      // URL di reindirizzamento con il JWT come parametro
      const redirectUrl = `${process.env.FRONTEND_URL}?token=${jwtToken}`;

      // Reindirizza al frontend con il token come parametro nell'URL
      res.redirect(redirectUrl);
    } catch (err) {
      // Gestione degli errori generici
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new GoogleAdapter(); // Esporta un'istanza della classe GoogleAdapter
