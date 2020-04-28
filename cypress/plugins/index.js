const admin = require('firebase-admin')
const cypressFirebasePlugin = require('cypress-firebase').plugin

require('dotenv-flow').config()

module.exports = (on, config) => {

	return Object.assign(config, cypressFirebasePlugin(on, config, admin), {
		env: {
			REACT_APP_BACKEND_PROJECT_ID: process.env.REACT_APP_BACKEND_PROJECT_ID,
			REACT_APP_BACKEND_API_KEY: process.env.REACT_APP_BACKEND_API_KEY,
			TEST_UID: process.env.TEST_UID,
		}
	})
}