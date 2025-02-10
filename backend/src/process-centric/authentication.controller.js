const express = require('express');
const router = express.Router();
const GoogleAdapter = require('../adapters/auth/oauth');
const userEncrypt = require('../business-logic/userEncrypt.service');
const authChecker = require('../adapters/auth/authChecker');

router.get("/", async (req, res) => {
    GoogleAdapter.login(req, res);
});

router.get("/callback", async (req, res) => {
    GoogleAdapter.callback(req, res);
});

router.get("/user", authChecker, async (req, res) => {
    try {
        const encryptedData = await userEncrypt.getUserData(req.user.googleId);
        res.send({ encryptedData });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });

module.exports = router;