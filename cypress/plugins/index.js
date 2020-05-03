const admin = require('firebase-admin')
const cypressFirebasePlugin = require('cypress-firebase').plugin

require('dotenv-flow').config()

module.exports = (on, config) => {
	// custom tasks for sending and reporting code coverage
	require('@cypress/code-coverage/task')(on, config)

	const env = {
		REACT_APP_BACKEND_PROJECT_ID: process.env.REACT_APP_BACKEND_PROJECT_ID,
		REACT_APP_BACKEND_API_KEY: process.env.REACT_APP_BACKEND_API_KEY,
		CI: process.env.CI,
		NODE_ENV: process.env.NODE_ENV,
		TEST_UID: process.env.TEST_UID,
	}

	// copy all variables prefixed with CY_
	for (const k in process.env) {
		if (k.match(/^CY_/) && process.env.hasOwnProperty(k)) {
			env[k] = parseInt(process.env[k]) || process.env[k] // convert to number if it's a stringified number
		}
	}

	// Extend the cypress configuration
	return Object.assign(config,
		// functions for interacting with Firestore
		cypressFirebasePlugin(on, config, admin),
		// propagate ENV-variables
		{
			env
		})
}