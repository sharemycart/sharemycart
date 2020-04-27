/* eslint-disable no-undef */

const projectId = process.env.REACT_APP_BACKEND_PROJECT_ID
const apiKey = process.env.REACT_APP_BACKEND_API_KEY

const config = {
	apiKey,
	authDomain: `${projectId}.firebaseapp.com`,
	databaseURL: `https://${projectId}.firebaseio.com`,
	projectId: `${projectId}`,
	storageBucket: `${projectId}.appspot.com`
}

export default config