import { observable, computed, action, decorate, runInAction } from 'mobx';
import { get, entries, remove } from 'mobx';
import * as firebaseService from './firebaseService';

export class Store {
	constructor() {
		this.activeUser = null;
		this.loading = false;
		this.authCheckComplete = false;
		this.items = new Map();
		this.initializationError = null;

		this.initializeStore().then(u => {
			this.activeUser = u;
			this.authCheckComplete = true;
		});
	}

	/**
	 * if we have an authenticated user then get all of the profile
	 * information from the database and associate it with the active
	 * user
	 * @param {*} _authUser
	 */
	handleAuthedUser = async _authUser => {
		if (_authUser) {
			let userAcctInfo = await firebaseService.getUserProfile();
			console.log('setting active user');
			this.activeUser = { ..._authUser, ...userAcctInfo };
		} else {
			this.activeUser = _authUser;
		}
		return this.activeUser;
	};

	/**
	 * check to see if we have a user before starting up
	 */
	async initializeStore() {
		return firebaseService
			.authCheck(this.handleAuthedUser)
			.then(_user => {
				return _user;
			})
			.catch(e => {
				return runInAction(() => {
					this.initializationError = e;
				});
			});
	}

	get doCheckAuth() {
		if (firebaseService.getCurrentUser()) {
			return this.activeUser;
		} else {
			return null;
		}
	}

	/**
	 * here we check to see if ionic saved a user for us
	 */
	get authenticatedUser() {
		return this.activeUser || null;
	}

	/**
	 * gets all of the items as an array from the map
	 */
	get itemEntries() {
		return entries(this.items);
	}

	/**
	 * get a specific item based on its key
	 * @param {*} _key
	 */
	itemByKey(_key) {
		return get(this.items, _key);
	}

	/**
	 * login using a username and password
	 */
	doLogin(_username, _password) {
		if (_username.length) {
			return firebaseService
				.loginWithEmail(_username, _password)
				.then(
					_result => {
						return true;
					},
					err => {
						console.log(err);
						return err;
					}
				)
				.catch(e => {
					console.log(e);
					return e;
				});
		}
	}

	/**
	 * login using facebook
	 */
	doFacebookLogin() {
		return firebaseService
			.loginWithFacebook()
			.then(
				_result => {
					return true;
				},
				err => {
					console.log(err);
					return err;
				}
			)
			.catch(e => {
				console.log(e);
				return e;
			});
	}

	/**
	 * login using google
	 */
	doGoogleLogin() {
		return firebaseService
			.loginWithGoogle()
			.then(
				_result => {
					return true;
				},
				err => {
					console.log(err);
					return err;
				}
			)
			.catch(e => {
				console.log(e);
				return e;
			});
	}

	/**
	 * create the user with the information and set the user object
	 */
	async doCreateUser(_params) {
		try {
			let newUser = await firebaseService.registerUser({
				email: _params.email,
				password: _params.password,
				firstName: _params.firstName,
				lastName: _params.lastName
			});
			return newUser;
		} catch (err) {
			console.log(err);
			return err;
			// for (let e of err.details) {
			//   if (e === "conflict_email") {
			//     alert("Email already exists.");
			//   } else {
			//     // handle other errors
			//   }
			// }
		}
	}

	/**
	 * logout and remove the user...
	 */
	doLogout() {
		this.activeUser = null;
		return firebaseService.logOut();
	}

	//
	// // DATA CRUD
	// loadData () {
	// 	return firebaseService
	// 		.queryObjectCollection({ collection: 'items' })
	// 		.then(
	// 			_result => {
	// 				// create the user object based on the data retrieved...
	// 				return runInAction(() => {
	// 					let resultMap = _result.reduce((map, obj) => {
	// 						map[obj.id] = obj;
	// 						return map;
	// 					}, {});
	// 					this.items = resultMap;
	// 					return resultMap;
	// 				});
	// 			},
	// 			err => {
	// 				console.log(err);
	// 				return err;
	// 			}
	// 		)
	// 		.catch(e => {
	// 			console.log(e);
	// 			return e;
	// 		});
	// }

	async addItem(_data) {
		return firebaseService.addItem(_data);
	}

	async editItem(id, _data) {
		return firebaseService.editItem(id, _data);
	}

	/**
	 *
	 * @param {String} id The id of the item to add
	 * @returns {Promise<boolean>}
	 */
	deleteItem(id) {
		return firebaseService
			.removeObjectFromCollection({ collection: 'Items', objectId: id })
			.then(
				_result => {
					// create the user object based on the data retrieved...
					return runInAction(() => {
						remove(this.items, id);
						return true;
					});
				},
				err => {
					console.log(err);
					return err;
				}
			)
			.catch(e => {
				console.log(e);
				return e;
			});
	}

	async getMyItems() {

		// firebaseService.getUser()

		// firebaseService.queryLists(user)

		// get the first list

		// firebaseService.getItemsOfList(list)

		return firebaseService.getMyItems();
	}

	async getNeedListsForSharedShoppingLists() {
		return firebaseService.getNeedListsForSharedShoppingLists()
	}

	async getItemsOfList(userId, listId) {
		return firebaseService.getItemsOfList(userId, listId)
	}

	async getCurrentList(userId, listId) {
		return firebaseService.getCurrentList(userId, listId)
	}
}

decorate(Store, {
	// OBSERVABLES
	activeUser: observable,
	loading: observable,
	authCheckComplete: observable,
	items: observable,
	initializationError: observable,

	// COMPUTED
	authenticatedUser: computed,
	doCheckAuth: computed,
	itemEntries: computed,
	getMyItems: action,
	getMyNeedLists: action,
	getItemsOfList: action,

	// ACTIONS
	doCreateUser: action,
	doLogin: action,
	doFacebookLogin: action,
	doGoogleLogin: action,
	doLogout: action,
	loadData: action,
	itemByKey: action,
	getCurrentList: action,
	addItem: action,
	editItem: action,
	deleteItem: action
});
