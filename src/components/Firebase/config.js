/* eslint-disable no-undef */

const config = {
	apiKey: process.env.REACT_APP_BACKEND_API_KEY,
	authDomain: process.env.REACT_APP_BACKEND_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_BACKEND_DATABASE_URL,
	projectId: process.env.REACT_APP_BACKEND_PROJECT_ID,
	storageBucket: process.env.REACT_APP_BACKEND_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_BACKEND_MESSAGE_SENDER_ID,
	appId: process.env.REACT_APP_BACKEND_SENDER_APP_ID,
	emailRedirect: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
}

export default config