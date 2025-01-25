const express = require("express");
const router = express.Router();

require("dotenv").config();

const GOOGLE_OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

router.get("/", async (req, res) => {
  const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
  const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${process.env.GOOGLE_OAUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&scope=${encodeURIComponent(scopes)}`;
  res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
});

router.get("/callback", async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.status(400).json({ error: "User denied consent" });
  }

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing" });
  }

  if (state !== req.session.oauthState) {
    return res.status(400).json({ error: "Invalid state parameter" });
  }

  try {
    const data = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      grant_type: "authorization_code",
    });

    const tokenResponse = await fetch(process.env.GOOGLE_ACCESS_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data,
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return res.status(tokenResponse.status).json({
        error: "Failed to fetch access token",
        details: errorText,
      });
    }

    const tokenData = await tokenResponse.json();
    const { id_token } = tokenData;

    const userInfoResponse = await fetch(`${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`);
    const userInfo = await userInfoResponse.json();

    req.session.userInfo = userInfo;

    // Recupera l'URL di reindirizzamento originale
    const redirectTo = req.session.redirectTo || "/";

    // Rimuovi redirectTo dalla sessione
    delete req.session.redirectTo;
    
    // Reindirizza l'utente alla pagina originale
    res.redirect(redirectTo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;