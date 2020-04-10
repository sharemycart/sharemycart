import { observable, action, computed } from 'mobx';
import toObject from '../lib/convertArrayToObject';

class UserStore {
  @observable users = {};

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action setUsers = (users) => {
    this.users = toObject(users);
  };

  @action setUser = (uid, user) => {
    if (!this.users) {
      this.users = {};
    }

    this.users[uid] = user;
  };

  @computed get userList() {
    return Object.keys(this.users || {}).map((key) => ({
      ...this.users[key],
      uid: key,
    }));
  }
}

export default UserStore;
