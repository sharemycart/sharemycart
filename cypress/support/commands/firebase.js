import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import { attachCustomCommands } from 'cypress-firebase'

const projectId = Cypress.env('REACT_APP_BACKEND_PROJECT_ID')
const apiKey = Cypress.env('REACT_APP_BACKEND_API_KEY')

const fbConfig = {
	apiKey,
	authDomain: `${projectId}.firebaseapp.com`,
	databaseURL: `https://${projectId}.firebaseio.com`,
	projectId: `${projectId}`,
	storageBucket: `${projectId}.appspot.com`
}

firebase.initializeApp(fbConfig)

attachCustomCommands({ Cypress, cy, firebase }) 