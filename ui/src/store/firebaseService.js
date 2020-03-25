import * as firebase from 'firebase'; // 4.3.0
import { v4 as uuid } from 'uuid';

require('firebase/firestore');

const FIREBASE_CONFIG = {
	apiKey: process.env.REACT_APP_BACKEND_API_KEY,
	authDomain: process.env.REACT_APP_BACKEND_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_BACKEND_DATABASE_URL,
	projectId: process.env.REACT_APP_BACKEND_PROJECT_ID,
	storageBucket: process.env.REACT_APP_BACKEND_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_BACKEND_MESSAGE_SENDER_ID,
	appId: process.env.REACT_APP_BACKEND_SENDER_APP_ID
};

// Ensure that you do not login twice.
if (!firebase.apps.length) {
	firebase.initializeApp(FIREBASE_CONFIG);
}

// const firestore = firebase.firestore();
// const settings = { timestampsInSnapshots: true };
// firestore.settings(settings);

/**
 * so this function is called when the authentication state changes
 * in the application, a side effect of that is that we need to get
 * the rest of the user data from the user collection, that is
 * done with the _handleAuthedUser callback
 */
export const authCheck = async _handleAuthedUser => {
	return new Promise(resolve => {
		// Listen for authentication state to change.
		firebase.auth().onAuthStateChanged(async user => {
			if (user != null) {
				console.log('We are authenticated now!');

				return resolve(await _handleAuthedUser(user));
			} else {
				console.log('We did not authenticate.');
				_handleAuthedUser(null);
				return resolve(null);
			}
		});
	});
};

/****************    Authentication    ******************/
/**
 *
 * @param {*} email
 * @param {*} password
 */
export const loginWithEmail = (email, password) => {
	return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const loginWithFacebook = () => {
	var provider = new firebase.auth.FacebookAuthProvider();
	provider.setCustomParameters({
		'display': 'popup'
	});
	return firebase.auth().signInWithPopup(provider);
};

export const loginWithGoogle = () => {
	var provider = new firebase.auth.GoogleAuthProvider();
	// @todo: in the future invite contacts to the app via email
	//	provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
	provider.setCustomParameters({
		'login_hint': 'johnsnow@thewallserver.com'
	});

	return firebase.auth().signInWithPopup(provider);
};

export const getCurrentUser = () => {
	return firebase.auth().currentUser;
};

export const getCurrentUserAsync = async () => {
	return firebase.auth().currentUser;
};
/**
 *
 */
export const logOut = () => {
	return firebase.auth().signOut();
};

/**
 *
 * @param {*} userInfo.lastName
 * @param {*} userInfo.firstName
 * @param {*} userInfo.email
 * @param {*} userInfo.password
 */
export const registerUser = userInfo => {
	console.log('in registerUser');
	return firebase
		.auth()
		.createUserWithEmailAndPassword(userInfo.email, userInfo.password)
		.then(newUser => {
			let { email, firstName, lastName } = userInfo;

			return firebase
				.firestore()
				.collection('Users')
				.doc(newUser.user.uid)
				.set({
					email,
					firstName,
					lastName
				})
				.then(() => {
					return { ...newUser, firstName, lastName };
				});
		});
};

export const getUserProfile = () => {
	let user = firebase.auth().currentUser;
	console.log(user);

	var userRef = firebase
		.firestore()
		.collection('users')
		.doc(user.uid);

	return userRef
		.get()
		.then(doc => {
			if (doc.exists) {
				console.log('Document data:', doc.data());
				return {
					...doc.data(),
					id: user.uid
				};
			} else {
				// doc.data() will be undefined in this case
				console.log('No such document!', user.uid);
				return null;
			}
		})
		.catch(error => {
			console.log('Error getting document:', error);
		});
};

/****************    Find    ******************/

/**
 * @param {CollectionReference} collectionRef
 * @param {Object[]} restrictions
 * @param {string} restrictions[].fieldPath
 * @param {string} restrictions[].operation
 * @param {string} restrictions[].value
 */
const _findFromRef = async ({ collectionRef, restrictions }, getData = false) => {
	let results = [];

	if (restrictions) {
		restrictions.forEach((restriction) => {
			collectionRef = collectionRef.where(restriction.fieldPath, restriction.operation, restriction.value)
		})
	}

	try {
		(await collectionRef.get()).forEach(doc => {
			if (getData) {
				results.push({
					id: doc.id,
					...doc.data()
				})
			} else {
				results.push(doc)
			};
		});
	} catch (e) {
		console.error('_findFromRef', e);
	}
	return results;
};

/****************    Retrieval    ******************/

/// User
const getUser = async (uid) => {
	if (!uid) return null

	const db = firebase.firestore();
	return db.collection('Users').doc(uid).data();
}

/// Lists

/// Queries
export const findLists = async ({ uid, restrictions, getData = false }) => {
	const db = firebase.firestore();

	const userDoc = await db.collection('Users').doc(uid)
	const collectionRef = await userDoc.collection('Lists')

	return _findFromRef({
		collectionRef,
		restrictions
	}, getData)
}

export const getLists = async ({ uid, restrictions }) => {
	if (!uid) return []
	return findLists({ uid, restrictions }, true)
}

export const findShoppingLists = async ({ uid, restrictions, getData = false }) => {
	const db = firebase.firestore();
	let fullRestrictions = restrictions || []

	fullRestrictions.push({
		fieldPath: 'Type',
		operation: '==',
		value: 'shopping'
	})

	const userDoc = await db.collection('Users').doc(uid)
	if (userDoc) {
		return findLists({ uid: userDoc.id, fullRestrictions, getData })
	}
}

export const getFirstShoppingList = async ({ uid, restrictions }) => {
	if (!uid) return []

	const shoppingLists = await findShoppingLists({ uid, restrictions, getData: true })
	return shoppingLists[0]
}

// ID Access
export const findListById = async ({ uid, listId }) => {
	const db = firebase.firestore();

	const userDoc = await db.collection('Users').doc(uid)
	return userDoc.collection('Lists').doc(listId)
}

export const getListById = async ({ uid, listId }) => {
	return findListById({ uid, listId }).data()
}

/// Items
export const findListItems = async ({ uid, listId, restrictions, getData }) => {
	if (!(uid && listId)) return [];
	const db = firebase.firestore();

	const userDoc = await db.collection('Users').doc(uid)
	const collectionRef = await userDoc.collection('Lists').doc(listId).collection('Items')

	return _findFromRef({
		collectionRef,
		restrictions
	}, getData)
}

export const getListItems = async ({ uid, listId }) => findListItems({ uid, listId, getData: true })

// ID access
export const findItemById = async ({ uid, listId, itemId }) => {
	const db = firebase.firestore();

	const userDoc = await db.collection('Users').doc(uid)
	return userDoc.collection('Lists').doc(listId).collection('Items').doc(itemId)
}

/****************    CRUD    ******************/

// List
export const createShoppingList = async ({ uid, list = {} }) => {
	const db = firebase.firestore();

	const id = list.id || uuid()
	list.type = 'shopping'

	const userDoc = await db.collection('Users').doc(uid)
	await userDoc.collection('Lists').doc(id).set(list)
	return list
}

// Item
export const createItem = async ({ uid, listId, item }) => {
	const db = firebase.firestore();

	const list = await findListById({ uid, listId })
	if (!list) {
		console.error('createItems: no such list')
		return null
	}

	const id = item.id || uuid()

	await db.collection('Users').doc(uid)
		.collection('Lists').doc(listId)
		.collection('Items').doc(id)
		.set(item)

	return item
}

export const updateItem = async ({ uid, listId, item }) => {
	const db = firebase.firestore();

	const editedItem = await findItemById({ uid, listId, itemId: item.id })

	if (!editedItem) {
		console.error('updateItem: no such item')
		return null
	}
	return db.collection('Users').doc(uid)
		.collection('Lists').doc(listId)
		.collection('Items').doc(item.id)
		.set(item)
}

export const deleteItem = async ({ uid, listId, item }) => {
	const db = firebase.firestore();

	const deletedItem = await findItemById({ uid, listId, itemId: item.id })

	if (!deletedItem) {
		console.error('deleteItem: no such item')
		return null
	}

	return db.collection('Users').doc(uid)
		.collection('Lists').doc(listId)
		.collection('Items').doc(item.id)
		.delete()
}
