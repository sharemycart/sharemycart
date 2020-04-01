import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';
import ShoppingModel from '../../../models/Shopping';
import ShoppingLists from './ShoppingLists';
import ShoppingItems from './ShoppingItems';
import DependentNeedsLists from './DependentNeedsLists';

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
    const { listsLoading, itemsLoading, editingListName } = this.state;
    const {
      shoppingListsArray: shoppingLists,
      currentShoppingListItemsArray: currentShoppingListItems,
      currentDependentNeedsListsArray: currentDependentNeedsLists
    } = shoppingStore;

    return (
      <div>
        <div id='shopping-lists'>
          {listsLoading && <div>Loading shopping lists...</div>}
          {itemsLoading && <div>Loading items...</div>}

          {shoppingLists && (
            <ShoppingLists
              authUser={sessionStore.authUser}
              shoppingLists={shoppingLists}
              onEditShoppingList={this.onEditShoppingList}
              onRemoveShoppingList={this.onRemoveShoppingList}
              onSetCurrentShoppingList={this.onSetCurrentShoppingList}
            />
          )}

          {!shoppingLists && <div>There are no shoppingLists ...</div>}

          <form
            onSubmit={event =>
              this.onCreateShoppingList(event, sessionStore.authUser)
            }
          >
            <input
              type="editingListName"
              value={editingListName}
              onChange={this.onChangeText}
            />
            <button type="submit">Create shopping list</button>
          </form>
        </div>
        <div id='current-shopping-list-items'>
          <h2>Items of current shopping list</h2>
          <ShoppingItems
            authUser={sessionStore.authUser}
            shoppingItems={currentShoppingListItems}
            onEditShoppingItem={this.onEditShoppingItem}
            onRemoveShoppingItem={this.onRemoveShoppingItem}
            onCreateShoppingItem={this.onCreateItemForCurrentShoppingList}
          />
        </div>
        <div id='dependent-needs-lists'>
        <h2>Dependent needs lists</h2>

        {currentDependentNeedsLists && (
            <DependentNeedsLists
              authUser={sessionStore.authUser}
              shoppingLists={currentDependentNeedsLists}
            />
          )}

          {!shoppingLists && <div>There are no dependent needs lists ...</div>}
          </div>
      </div>
    );
  }
}

export default compose(
  withFirebase,
  inject('shoppingStore', 'sessionStore'),
  observer,
)(Shopping);