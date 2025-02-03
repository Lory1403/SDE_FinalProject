const express = require("express");
const router = express.Router();
const DbSaveController = require("../process-centric/dbSave.controller.js");
const authChecker = require("../adapters/auth/authChecker.js");

router.post("/", authChecker, async (req, res) => {
    try {
        const { track } = req.body;

        if (!track) {
            return res.status(400).json({ message: "Track data is required." });
        }

        const trackData = {
            track,
            email: req.user.email,
            timestamp: new Date()
        };

        const savedTrack = await DbSaveController.saveTrack(trackData);

        res.status(201).json({ message: "Track saved successfully", track: savedTrack });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;