import { observable, action, computed } from 'mobx';
import toObject from '../lib/convertArrayToObject';

// This store holds all information needed to create and manage shopping lists 
// and their items

class ShoppingStore {
  @observable shoppingLists = null;
  @observable currentShoppingListItems = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action setShoppingLists = shoppingLists => {
    this.shoppingLists = shoppingLists;
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

  @computed get currentShoppingList() {
    const currentShoppingLists = this.shoppingListsArray.filter( shoppingList => !!shoppingList.isCurrent);
    return (currentShoppingLists.length > 0 && currentShoppingLists[0]) || null
  }

}

export default ShoppingStore;
