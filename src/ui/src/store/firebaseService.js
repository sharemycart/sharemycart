import * as firebase from 'firebase'; // 4.3.0
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
				.collection('users')
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

/**
 *
 */
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

/**
 *
 * @param {*} param0
 */
export const queryObjectCollection = ({ collection }) => {
	//let currentUserId = firebase.auth().currentUser.uid;
	let collectionRef = firebase.firestore().collection(collection);

	let results = [];

	return (
		collectionRef
			//.where('owner', '==', currentUserId)
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					// doc.data() is never undefined for query doc snapshots
					results.push({
						id: doc.id,
						...doc.data()
					});
				});
				return results;
			})
			.catch(error => {
				console.log('Error getting documents: ', error);
				return error;
			})
	);
};

export const getMyFirstListDocument = async () => {
	let currentUser = await getCurrentUserAsync();
	let db = firebase.firestore();
	if (!currentUser) {
		return null;
	}
	let userDocument = await db.collection('Users').doc(currentUser.uid);

	let allLists = await userDocument.collection('Lists').where('Type', '==', 'shopping').get();
	let firstList = null;
	allLists.forEach(doc => {
		firstList = doc;
		return false;
	});
	return firstList;
};

export const addItem = async (item) => {
	let firstList = await getMyFirstListDocument();
	if (firstList) {
		let newItems = (firstList.data().Items || []).concat(item);
		await firstList.ref.set({ Items: newItems }, { merge: true });
	}
	return item;
};

export const editItem = async (id, data) => {
	let firstList = await getMyFirstListDocument();
	if (firstList) {
		let newItems = (firstList.data().Items || []).map(i => i.id === id ? data : i);
		await firstList.ref.set({ Items: newItems }, {merge: true});
	}
	return data;
};

export const getMyItems = async () => {
	let firstList = await getMyFirstListDocument();
	console.log('firstlist', firstList);
	let items = firstList ? firstList.data().Items : [];
	console.log('items', items);
	return items || [];
};

/**
 *
 * @param {*} _collection - name of collection to add object to
 * @param {*} _objectData - data to add to the collection
 */
export const addObjectToCollection = ({ collection, objectData }) => {
	let currentUserId = firebase.auth().currentUser.uid;
	let collectionRef = firebase.firestore().collection(collection);

	return collectionRef
		.add({
			owner: currentUserId,
			content: { ...objectData },
			created: new Date().getTime(),
			updated: new Date().getTime()
		})
		.then(
			async doc => {
				console.log(`addObjectToCollection ${collection} ${doc}`);

				let docData = await getByRef(doc);
				return docData;
			},
			error => {
				console.log(`ERROR: addObjectToCollection ${collection} ${error}`);
				return error;
			}
		)
		.catch(e => {
			console.log(`ERROR: addObjectToCollection ${collection} ${e}`);
			return e;
		});
};

/**
 *
 * @param {*} collection - name of collection
 * @param {*} objectId - id of data to remove from the collection
 */
export const removeObjectFromCollection = ({ collection, objectId }) => {
	// let currentUserId = firebase.auth().currentUser.uid;
	let collectionRef = firebase.firestore().collection(collection);

	return collectionRef.doc(objectId).delete()
		.then(
			async doc => {
				console.log(`removeObjectFromCollection ${collection} ${objectId}`);
				return true;
			},
			error => {
				console.log(`ERROR: removeObjectFromCollection ${collection} ${error}`);
				return error;
			}
		)
		.catch(e => {
			console.log(`ERROR: removeObjectFromCollection ${collection} ${e}`);
			return e;
		});
};

export const getByRef = _documentRef => {
	return _documentRef
		.get()
		.then(doc => {
			if (doc.exists) {
				return { ...doc.data(), id: _documentRef.id };
			} else {
				// doc.data() will be undefined in this case
				console.log('No such document!');
				return null;
			}
		})
		.catch(error => {
			console.log('Error getting document:', error);
			return error;
		});
};

/**
 *
 * @param {*} blob
 */
export const uploadImage = blob => {
	return new Promise((resolve, reject) => {
		let currentUserId = firebase.auth().currentUser.uid;
		const ref = firebase
			.storage()
			.ref(currentUserId)
			.child(new Date().getTime() + '-' + currentUserId + '.jpeg');

		const task = ref.put(blob);

		task.on(
			firebase.storage.TaskEvent.STATE_CHANGED,
			snapshot =>
				console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
			error => {
				console.log('error', error);
				return reject(error);
			},
			result => {
				return resolve({
					url: task.snapshot.downloadURL,
					contentType: task.snapshot.metadata.contentType,
					name: task.snapshot.metadata.name,
					size: task.snapshot.metadata.size
				});
			}
		);
	});
};
