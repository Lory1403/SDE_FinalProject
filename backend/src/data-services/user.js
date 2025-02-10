const User = require("../adapters/database/models/user.model");

const getUserByGoogleId = async (googleId) => {
  return await User.findOne({ googleId }).lean();
};

module.exports = {
  getUserByGoogleId,
};