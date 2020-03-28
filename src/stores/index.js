import SessionStore from './sessionStore';
import UserStore from './userStore';
import MessageStore from './messageStore';
import ShoppingStore from './shoppingStore';

class RootStore {
  constructor() {
    this.sessionStore = new SessionStore(this);
    this.userStore = new UserStore(this);
    this.messageStore = new MessageStore(this);
    this.shoppingStore = new ShoppingStore(this);
  }
}

const rootStore = new RootStore();

export default rootStore;
