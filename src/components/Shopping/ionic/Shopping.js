import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import ShoppingList from './ShoppingList';

class Shopping extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingListName: '',
    };
  }

  render() {
    const { shoppingStore, sessionStore } = this.props;
    const {
      // shoppingListsArray: shoppingLists,
      currentShoppingList,
      currentShoppingListItemsArray: currentShoppingListItems,
      currentDependentNeedsListsArray: currentDependentNeedsLists
    } = shoppingStore;

    return (

      // visualize the current shopping list
      currentShoppingList &&
      <ShoppingList
        authUser={sessionStore.authUser}
        list={currentShoppingList}
        items={currentShoppingListItems}
        dependentNeedLists={currentDependentNeedsLists}
        onCreateItem={this.props.model.onCreateItemForCurrentShoppingList}
        onEditItem={this.props.model.onEditShoppingItem}
        onDeleteItem={this.props.model.onRemoveShoppingItem}
      />
    );
  }
}

export default compose(
  inject('shoppingStore', 'sessionStore'),
  observer,
)(Shopping);
