import { observable, action, computed } from 'mobx';
import toObject from '../lib/convertArrayToObject';

// This store holds all information needed to create and manage needs lists 
// and their items

class NeedsStore {
  @observable needsLists = null;
  @observable currentNeedsList = null;
  @observable currentNeedsListItems = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action setNeedsLists = needsLists => {
    this.needsLists = toObject(needsLists);

    const currentNeedsLists = needsLists.filter(needsList => !!needsList.isCurrent);
    this.currentNeedsList = (currentNeedsLists.length > 0 && currentNeedsLists[0]) || null

  };

  @action setCurrentNeedsListItems = (items) => {
    this.currentNeedsListItems = toObject(items);
  }

  @computed get needsListsArray() {
    return Object.keys(this.needsLists || {}).map(key => ({
      ...this.needsLists[key],
      uid: this.needsLists[key].uid,
    }));
  }

  @computed get currentNeedsListItemsArray() {
    return Object.keys(this.currentNeedsListItems || {}).map(key => ({
      ...this.currentNeedsListItems[key],
      uid: this.currentNeedsListItems[key].uid,
    }));
  }
}

export default NeedsStore;
