const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const TrackModel = require("../adapters/database/models/track.model");
const authChecker = require("../adapters/auth/authChecker.js");

const getUserTracks = async (googleId) => {
    try {
        const userTracks = await TrackModel.find({ googleId });
        return userTracks;
    } catch (error) {
        throw new Error("Error retrieving user tracks: " + error.message);
    }
};

router.get("/", authChecker, async (req, res) => {
    try {
        const googleId = req.user.googleId;
        const userTracks = await getUserTracks(googleId);
        res.status(200).json({ tracks: userTracks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
