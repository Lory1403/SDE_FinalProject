const express = require("express");
const router = express.Router();
const DbGetController = require("../process-centric/dbGetTracks.controller.js");
const authChecker = require("../adapters/auth/authChecker.js");

router.get("/", authChecker, async (req, res) => {
    try {
        const googleId = req.user.googleId;

        const userTracks = await DbGetController.getUserTracks(googleId);

        res.status(200).json({ tracks: userTracks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;