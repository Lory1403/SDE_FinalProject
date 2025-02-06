const express = require("express");
const router = express.Router();
const User = require("../adapters/database/models/user.model");
const aesjs = require('aes-js');

// Route to get user information by Google ID
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ googleId: req.user.googleId }).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Cripta i dati dell'utente
    const encryptedData = encryptData(JSON.stringify(user));

    // Invia i dati criptati al frontend
    res.send({ encryptedData });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Funzione per crittografare i dati
function encryptData(data) {
  const textBytes = aesjs.utils.utf8.toBytes(data);
  const aesCtr = new aesjs.ModeOfOperation.ctr(aesjs.utils.utf8.toBytes(process.env.ENCRYPTION_KEY));
  const encryptedBytes = aesCtr.encrypt(textBytes);
  return aesjs.utils.hex.fromBytes(encryptedBytes);
}

module.exports = router;