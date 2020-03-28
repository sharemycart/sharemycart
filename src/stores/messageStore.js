import { observable, action, computed } from 'mobx';
import toObject from '../lib/convertArrayToObject';


class MessageStore {
  @observable messages = null;
  @observable limit = 5;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action setMessages = messages => {
    this.messages = toObject(messages);
  };

  @action setLimit = limit => {
    this.limit = limit;
  };

  @computed get messageList() {
    return Object.keys(this.messages || {}).map(key => ({
      ...this.messages[key],
      uid: key,
    }));
  }
}

export default MessageStore;
