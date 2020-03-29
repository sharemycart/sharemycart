import { observable, action, computed, reaction } from 'mobx';
import toObject from '../lib/convertArrayToObject';

// This store holds all information needed to create and manage shopping lists 
// and their items

class ShoppingStore {
  @observable shoppingLists = null;
  @observable currentShoppingList = null;
  @observable currentShoppingListItems = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action setShoppingLists = shoppingLists => {
    this.shoppingLists = toObject(shoppingLists);

    const currentShoppingLists = shoppingLists.filter(shoppingList => !!shoppingList.isCurrent);
    this.currentShoppingList = (currentShoppingLists.length > 0 && currentShoppingLists[0]) || null

  };

  @action setCurrentShoppingListItems = (items) => {
    this.currentShoppingListItems = toObject(items);
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
    }));
  }
}

export default ShoppingStore;
