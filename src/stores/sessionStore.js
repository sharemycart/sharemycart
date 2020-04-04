import { observable, action } from 'mobx';

class SessionStore {
  @observable authUser = null;
  @observable dbAuthenticated = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action setAuthUser = authUser => {
    this.authUser = authUser;
  };

  @action setDbAuthenticated = authenticated => this.dbAuthenticated = authenticated
}

export default SessionStore;
