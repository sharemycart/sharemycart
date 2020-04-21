const admin = require("firebase-admin");
const cypressFirebasePlugin = require("cypress-firebase").plugin;

module.exports = (on, config) => {
  // Pass on function, config, and admin instance. Returns extended config
  return cypressFirebasePlugin(on, config, admin);
};