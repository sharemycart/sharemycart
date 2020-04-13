import { observable, action, computed, toJS } from 'mobx';
import toObject from '../lib/convertArrayToObject';

// This store holds all information needed to create and manage shopping lists 
// and their items

class ShoppingStore {
  @observable shoppingLists = null;
  @observable currentShoppingList = null;
  @observable currentShoppingListItems = null;
  @observable currentDependentNeedsLists = null;
  @observable currentDependentNeedsListsItems = null;
  @observable initializationDone = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action setInitializationDone(done) {
    this.initializationDone = done;
  }

  @action setShoppingLists = shoppingLists => {
    this.shoppingLists = toObject(shoppingLists);

    const currentShoppingLists = shoppingLists.filter(shoppingList => !!shoppingList.isCurrent);
    this.currentShoppingList = (currentShoppingLists.length > 0 && currentShoppingLists[0]) || null
  };

  @action setCurrentShoppingListItems = (items) => {
    this.currentShoppingListItems = toObject(items);
  }

  @action setCurrentDependentNeedsLists = (lists) => {
    this.currentDependentNeedsLists = toObject(lists);
  }

  @action setDependentNeedsListItems = (listId, items) => {
    this.currentDependentNeedsLists[listId].items = items;
  }

  @computed get shoppingListsArray() {
    return Object.keys(this.shoppingLists || {}).map(key => ({
      ...this.shoppingLists[key],
      uid: this.shoppingLists[key].uid,
    }));
  }

  @computed get currentShoppingListItemsArray() {
    return Object.keys(this.currentShoppingListItems || {}).map(key => ({
      ...this.currentShoppingListItems[key],
      uid: this.currentShoppingListItems[key].uid,
    }))
      .sort((a, b) => {
        if (a.order && b.order && a.order !== b.order) return a.order - b.order;
        if (a.order && !b.order) return a.order;
        if (!a.order && b.order) return -1 * b.order;
        if (a.createdAt && b.createdAt) return b.createdAt.seconds - a.createdAt.seconds;
        if (!a.createdAt) return -1
        if (!b.createdAt) return 1
        return 0
      })
  }

  @computed get currentDependentNeedsListsArray() {
    return Object.keys(this.currentDependentNeedsLists || {}).map(key => ({
      ...this.currentDependentNeedsLists[key],
      uid: this.currentDependentNeedsLists[key].uid,
    }));
  }

  @computed get currentDependentNeedsListsItemsArray() {
    return Object.keys(this.currentDependentNeedsLists || {}).reduce((allItems, key) => {
      const needsListId = this.currentDependentNeedsLists[key].uid;
      const ownerId = this.currentDependentNeedsLists[key].userId;
      const neededItems = toJS(this.currentDependentNeedsLists)[key].items;
      return allItems.concat(neededItems || []).map(
        neededItem => Object.assign(neededItem, { needsListId, ownerId }
        ))
    }, []);
  }
}

export default ShoppingStore;

