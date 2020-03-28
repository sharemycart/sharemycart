import { observable, action, computed } from 'mobx';
import toObject from '../lib/convertArrayToObject';

// This store holds all information needed to create and manage shopping lists 
// and their items

class ShoppingStore {
  @observable shoppingLists = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action setShoppingLists = shoppingLists => {
    this.shoppingLists = shoppingLists;
  };

  @action setItemsOfShoppingList = (shoppingListUid, items) => {
    this.shoppingLists[shoppingListUid].items = toObject(items);
  }

  @computed get shoppingListsArray() {
    return Object.keys(this.shoppingLists || {}).map(key => ({
      ...this.shoppingLists[key],
      uid: this.shoppingLists[key].uid,
      // items: Object.keys(this.shoppingLists[key].items || {}).map(key => ({
      //   ...this.shoppingLists[key].items[key],
      //   uid: key
      // }))
    }));
  }
}

export default ShoppingStore;
