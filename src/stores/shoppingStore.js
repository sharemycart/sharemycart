import { observable, action, computed, toJS } from 'mobx';
import toObject from '../lib/convertArrayToObject';
import sortItems from '../components/Reusables/functions/sortItems';

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
      .sort((a, b) => sortItems(a, b));
  }

  @computed get currentDependentNeedsListsArray() {
    return Object.keys(this.currentDependentNeedsLists || {}).map(key => ({
      ...this.currentDependentNeedsLists[key],
      uid: this.currentDependentNeedsLists[key].uid,
    }));
  }

  @computed get currentDependentNeedsListsItemsArray() {
    if (!this.currentDependentNeedsLists) return []

    let allDependentNeededItems = []
    
    Object.keys(this.currentDependentNeedsLists || {}).forEach((key) => {
      const neededItems = this.currentDependentNeedsLists[key].items;
      if (neededItems && neededItems.length) {
        const needsList = this.currentDependentNeedsLists[key];
        allDependentNeededItems = allDependentNeededItems.concat(neededItems.map(
          neededItem => Object.assign(toJS(neededItem),
            {
              needsListId: toJS(needsList.uid),
              ownerId: toJS(needsList.userId)
            }
          )));
      }
    })
    return allDependentNeededItems
  }
}

export default ShoppingStore;

