import { decorate, observable, action, computed } from 'mobx'
import toObject from '../lib/convertArrayToObject'
class UserStore {
	users = {};

	constructor(rootStore) {
		this.rootStore = rootStore
	}

	setUsers = users => {
		this.users = toObject(users)
	};

	setUser = (uid, user) => {
		if (!this.users) {
			this.users = {}
		}

		this.users[uid] = user
	};

	get userList() {
		return Object.keys(this.users || {}).map(key => ({
			...this.users[key],
			uid: key,
		}))
	}
}

decorate(UserStore, {
	users: observable,

	setUser: action,
	setUsers: action,

	userList: computed,
})

export default UserStore
