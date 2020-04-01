import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';
import ShoppingList from './ShoppingList';
import ShoppingModel from '../../../models/Shopping';

class Shopping extends ShoppingModel {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state,
      {
        editingListName: '',
      });
  }

  render() {
    const { shoppingStore, sessionStore } = this.props;
    const { listsLoading, itemsLoading } = this.state;
    const {
      // shoppingListsArray: shoppingLists,
      currentShoppingList,
      currentShoppingListItemsArray: currentShoppingListItems,
      currentDependentNeedsListsArray: currentDependentNeedsLists
    } = shoppingStore;

    return (

      // visualize the current shopping list
      !(listsLoading || itemsLoading) && currentShoppingList &&
      <ShoppingList
        authUser={sessionStore.authUser}
        list={currentShoppingList}
        items={currentShoppingListItems}
        dependentNeedLists={currentDependentNeedsLists}
        onEditItem={this.onEditShoppingList}
        onCreateItem={this.onCreateItemForCurrentShoppingList}
        onEditItem={this.onEditShoppingItem}
        onDeleteItem={this.onRemoveShoppingItem}
      />
    );
  }
}

export default compose(
  withFirebase,
  inject('shoppingStore', 'sessionStore'),
  observer,
)(Shopping);
