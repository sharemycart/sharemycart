import { observable, action, computed } from 'mobx';
import toObject from '../lib/convertArrayToObject';

// This store holds all information needed to create and manage needs lists
// and their items

class NeedsStore {
  @observable needsLists = null;

  @observable currentNeedsList = null;

  @observable currentNeedsListItems = null;

  @observable currentOriginShoppingList = null;

  @observable currentOriginShoppingListItems = null;

  @observable initializationDone = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action setInitializationDone(done) {
    this.initializationDone = done;
  }

  @action setNeedsLists = (needsLists) => {
    this.needsLists = toObject(needsLists);

    const currentNeedsLists = needsLists.filter((needsList) => !!needsList.isCurrent);
    this.currentNeedsList = (currentNeedsLists.length > 0 && currentNeedsLists[0]) || null;
  };

  @action setCurrentNeedsListItems = (items) => {
    this.currentNeedsListItems = toObject(items);
  }

  @action setCurrentOriginShoppingList = (shoppingList) => this.currentOriginShoppingList = shoppingList;

  @action setCurrentOriginShoppingListItems = (items) => {
    this.currentOriginShoppingListItems = toObject(items);
  }

  @computed get needsListsArray() {
    return Object.keys(this.needsLists || {}).map((key) => ({
      ...this.needsLists[key],
      uid: this.needsLists[key].uid,
    }));
  }

  @computed get currentNeedsListItemsArray() {
    return Object.keys(this.currentNeedsListItems || {}).map((key) => ({
      ...this.currentNeedsListItems[key],
      uid: this.currentNeedsListItems[key].uid,
    }))
      .sort((a, b) => {
        if (a.order && b.order) return a.order - b.order;
        return a.createdAt - b.createdAt;
      });
  }

  @computed get potentiallyNeededItemsArray() {
    // all items from the current origin shopping list are potential needs
    // which are not already moved to the needs list
    const needsByName = {};
    Object.keys(this.currentNeedsListItems || {}).forEach((key) => {
      const item = this.currentNeedsListItems[key];
      needsByName[item.name] = item;
    });

    return Object.keys(this.currentOriginShoppingListItems || {})
      .map((key) => ({
        ...this.currentOriginShoppingListItems[key],
        uid: this.currentOriginShoppingListItems[key].uid,
      }))
      .filter((item) => !needsByName[item.name])
      .sort((a, b) => {
        if (a.order && b.order) return a.order - b.order;
        return a.createdAt - b.createdAt;
      });
  }
}

export default NeedsStore;
