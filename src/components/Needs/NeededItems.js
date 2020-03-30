import React from 'react';

import NeededItem from './NeededItem';

const NeededItems = ({
  authUser,
  neededItems,
  onEditNeededItem,
  onRemoveNeededItem,
  onCreateNeededItem,
}) => (
    <div>
      <ul>
        {(neededItems || []).map(item => (
          <NeededItem
            authUser={authUser}
            key={item.uid}
            neededItem={item}
            onEditNeededItem={onEditNeededItem}
            onRemoveNeededItem={onRemoveNeededItem}
          />
        ))}
      </ul>
      <form
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
    </div >
  );

export default NeededItems;
