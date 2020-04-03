import React from 'react';

import NeededItem from './NeededItem';

const NeededItems = ({
  authUser,
  neededItems,
  OriginShoppingList,
  onEditNeededItem,
  onRemoveNeededItem,
  onCreateNeededItem,
  onAddFromShoppingListItem,
}) => (
    <div>
      <ul>
        {(neededItems || []).map(item => (
          <NeededItem
            authUser={authUser}
            key={item.uid}
            neededItem={item}
            OriginShoppingList={OriginShoppingList}
            onEditNeededItem={onEditNeededItem}
            onRemoveNeededItem={onRemoveNeededItem}
            onAddFromShoppingListItem={onAddFromShoppingListItem}
          />
        ))}
      </ul>
      {OriginShoppingList && <form
        onSubmit={event => {
          event.preventDefault();
          const item = {
            name: 'Need this',
            quantity: 1,
            unit: 'pc',
          }
          onCreateNeededItem(item);
        }
        }
      >
        {/* <input
          type="editingListName"
          value={editingListName}
          onChange={this.onChangeText}
        /> */}
        <button type="submit">new needed item</button>
      </form>
      }
    </div >
  );

export default NeededItems;
