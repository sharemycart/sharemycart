const admin = require("firebase-admin");
const cypressFirebasePlugin = require("cypress-firebase").plugin;

module.exports = (on, config) => {
  // Pass on function, config, and admin instance. Returns extended config
 cypressFirebasePlugin(on, config, admin);

    // we can grab some process environment variables
  // and stick it into config.env before returning the updated config
  config.env = process.env || {}
  console.log('extended config.env with process.env.', JSON.stringify(process.env))

  return config


};