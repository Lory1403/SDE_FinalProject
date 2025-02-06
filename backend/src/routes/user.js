const express = require("express");
const router = express.Router();
const User = require("../adapters/database/models/user.model");

// Route to get user information by Google ID
router.get("/:googleId", async (req, res) => {
  try {
    const user = await User.findOne({ googleId: req.params.googleId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;