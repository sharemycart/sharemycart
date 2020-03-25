import { observable, computed, action, decorate, runInAction } from 'mobx';
import { get, entries, remove } from 'mobx';
import * as firebaseService from './firebaseService';

export class Store {
	constructor() {
		this.currentUser = null;
		this.loading = false;
		this.authCheckComplete = false;
		this.initializationError = null;

		this.initializeStore().then(u => {
			this.currentUser = u;
			this.authCheckComplete = true;
		});
	}

	/**
	 * if we have an authenticated user then get all of the profile
	 * information from the database and associate it with the active
	 * user
	 * @param {*} _authUser
	 */
	handleAuthorizedUser = async _authUser => {
		if (_authUser) {
			let userAcctInfo = await firebaseService.getUserProfile();
			console.log('setting active user');
			this.currentUser = { ..._authUser, ...userAcctInfo };
		} else {
			this.currentUser = _authUser;
		}
		return this.currentUser;
	};

	/**
	 * check to see if we have a user before starting up
	 */
	async initializeStore() {
		return firebaseService
			.authCheck(this.handleAuthorizedUser)
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
			return this.currentUser;
		} else {
			return null;
		}
	}

	/**
	 * here we check to see if ionic saved a user for us
	 */
	get authenticatedUser() {
		return this.currentUser || null;
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
		let newUser = await firebaseService.registerUser({
			email: _params.email,
			password: _params.password,
			firstName: _params.firstName,
			lastName: _params.lastName
		});
		return newUser;
	}

	/**
	 * logout and remove the user...
	 */
	doLogout() {
		this.currentUser = null;
		return firebaseService.logOut();
	}

	/****************** CRUD *****************/

	/// List
	async addShoppingList(list) {
		return firebaseService.createShoppingList({ uid: this.currentUser.uid, list })
	}

	/// Item
	async addItem({ listId, item }) {
		// we can only add items to our own lists
		firebaseService.createItem({ uid: this.currentUser.uid, listId, item: item })
	}

	async editItem({ listId, item }) {
		// we can only edit our own items
		firebaseService.updateItem({ uid: this.currentUser.uid, listId, item });
	}

	async deleteItem({ listId, item }) {
		// we can only edit our own items
		firebaseService.deleteItem({ uid: this.currentUser.uid, listId, item });
	}

	/************    Business functions    *************/

	async getMyCurrentShoppingList(getData) {
		return firebaseService.getFirstShoppingList({ uid: this.currentUser.uid })
	}

	// async getMyCurrentNeedList(getData) {
	// 	const currentUser = await firebaseService.getCurrentUserAsync()
	// 	return firebaseService.getFirstNeedsList(currentUser.uid)
	// }

	async getMyCurrentShoppingListItems() {
		const currentShoppingList = await this.getMyCurrentShoppingList()

		return firebaseService.getListItems({ uid: this.currentUser.uid, listId: currentShoppingList.id })
	}

	/**
	 * 
	 * @param {string} uid The id of the user owning the shopping list
	 * @param {string} shoppingListId The id of the shopping list which is being shopped
	 */
	async getJoinedNeeds({ uid, shoppingListId }) {

		// Mock data
		return [
			{
				uid: 'utsavsuid',
				userFirstName: 'Utsav',
				userLastName: 'Anand',
				neededItems: {
					Bananas: 5,
					Tomatoes: 3
				}
			},
			{
				uid: 'oliversuid',
				userFirstName: 'Oliver',
				userLastName: 'Jägle',
				neededItems: {
					Whiskey: 1,
				}
			}
		]
	}

	// async getMyCurrentNeedList() {
	// 	return this.state.Lists.friendNeed1

	// 	// return this.findMyCurrentShoppingList(true)
	// };

	// async getMyCurrentNeedListItems(originListId = null) {
	// 	return this.state.Lists.friendNeed1.Items
	// }

	// async getMyCurrentNeedListItems(uid, listId) {
	// 	// TODO:
	// 	return this.state.Lists.myShopping1.Items
	// }
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

	// ACTIONS

	// Authentication
	doCreateUser: action,
	doLogin: action,
	doFacebookLogin: action,
	doGoogleLogin: action,
	doLogout: action,

	// Lists
	addShoppingList: action,
	getMyCurrentShoppingListItems: action,
	getMyNeedLists: action,

	// Items
	addItem: action,
	editItem: action,
	deleteItem: action
});
