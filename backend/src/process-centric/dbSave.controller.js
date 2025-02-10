const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const TrackModel = require("../adapters/database/models/track.model");
const authChecker = require("../adapters/auth/authChecker.js");

const saveTrack = async (trackData) => {
    try {
        const { summary, difficulty, geometry, name } = trackData.track;

        const newTrack = new TrackModel({
            name: name,
            distance: summary.distance,
            duration: summary.duration,
            heightDiff: summary.heightDiff,
            up: summary.up,
            down: summary.down,
            coordinates: geometry.coordinates,
            googleId: trackData.googleId,
            timestamp: trackData.timestamp,
            cmpIdx: difficulty.cmpIdx,
            CAI: difficulty.CAI
        });

        const savedTrack = await newTrack.save();
        return savedTrack;
    } catch (error) {
        throw new Error("Error saving track: " + error.message);
    }
};

router.post("/", authChecker, async (req, res) => {
    try {
        const { track } = req.body;

        if (!track) {
            return res.status(400).json({ message: "Track data is required." });
        }

        const trackData = {
            track,
            googleId: req.user.googleId,
            timestamp: new Date()
        };

        const savedTrack = await saveTrack(trackData);

        res.status(201).json({ message: "Track saved successfully", track: savedTrack });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
