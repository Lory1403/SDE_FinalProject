const userService = require("../data-services/user");
const aesjs = require('aes-js');

const getUserData = async (googleId) => {
  const user = await userService.getUserByGoogleId(googleId);

  if (!user) {
    throw new Error("User not found");
  }

  // Encrypt user data
  const encryptedData = encryptData(JSON.stringify(user));
  return encryptedData;
};

// Function to encrypt data
function encryptData(data) {
  const textBytes = aesjs.utils.utf8.toBytes(data);
  const aesCtr = new aesjs.ModeOfOperation.ctr(aesjs.utils.utf8.toBytes(process.env.ENCRYPTION_KEY));
  const encryptedBytes = aesCtr.encrypt(textBytes);
  return aesjs.utils.hex.fromBytes(encryptedBytes);
}

module.exports = {
  getUserData,
};