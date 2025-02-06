const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  coordinates: {
    type: [[Number]],
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  heightDiff: {
    type: Number,
    required: true
  },
  up: {
    type: Number,
    required: true
  },
  down: {
    type: Number,
    required: true
  },
  cmpIdx: {
    type: String,
    required: true
  },
  CAI: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Track', trackSchema);