import { observable, action, decorate } from 'mobx'

class SessionStore {
	authUser = null;
	dbAuthenticated = false;

	constructor(rootStore) {
		this.rootStore = rootStore
	}

	setAuthUser = authUser => {
		this.authUser = authUser
	};

	setDbAuthenticated = authenticated => this.dbAuthenticated = authenticated
}

decorate(SessionStore, {
	authUser: observable,
	dbAuthenticated: observable,

	setAuthUser: action,
	setDbAuthenticated: action,
})

export default SessionStore
