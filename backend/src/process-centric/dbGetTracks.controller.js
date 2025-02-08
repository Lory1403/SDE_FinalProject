const mongoose = require("mongoose");
const TrackModel = require("../adapters/database/models/track.model");

const getUserTracks = async (googleId) => {
    try {
        const userTracks = await TrackModel.find({ googleId });
        return userTracks;
    } catch (error) {
        throw new Error("Error retrieving user tracks: " + error.message);
    }
};

module.exports = { getUserTracks };