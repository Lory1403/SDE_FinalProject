const mongoose = require("mongoose");
const TrackModel = require("../adapters/database/models/track.model");

const saveTrack = async (trackData) => {
    try {
        const { summary, difficulty, geometry } = trackData.track;
        email = trackData.email;

        const newTrack = new TrackModel({
            distance: summary.distance,
            duration: summary.duration,
            heightDiff: summary.heightDiff,
            up: summary.up,
            down: summary.down,
            coordinates: geometry.coordinates,
            email: email,
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

module.exports = { saveTrack };