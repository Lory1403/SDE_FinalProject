const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  googleId: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true, default: Date.now }
});

const User = mongoose.model("User", userSchema);

module.exports = User;