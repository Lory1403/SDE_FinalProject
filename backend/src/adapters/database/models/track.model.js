const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    duration: { type: Number, required: true }, // in minuti
    suggestions: [String], // Percorsi correlati o suggerimenti
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", RouteSchema);

module.exports = Route;
