import React from 'react';

import ShoppingItem from './ShoppingItem';

const ShoppingItems = ({
  authUser,
  shoppingItems,
  onEditShoppingItem,
  onRemoveShoppingItem,
  onCreateShoppingItem,
}) => (
    <div>
      <ul>
        {(shoppingItems || []).map(item => (
          <ShoppingItem
            authUser={authUser}
            key={item.uid}
            shoppingItem={item}
            onEditShoppingItem={onEditShoppingItem}
            onRemoveShoppingItem={onRemoveShoppingItem}
          />
        ))}
      </ul>
      <form
        onSubmit={event => {
          event.preventDefault();
          const item = {
            name: 'Neuer',
            quantity: 1,
            unit: 'pc',
          }
          onCreateShoppingItem(item);
        }
        }
      >
        {/* <input
          type="editingListName"
          value={editingListName}
          onChange={this.onChangeText}
        /> */}
        <button type="submit">neu</button>
      </form>
    </div >
  );

export default ShoppingItems;
