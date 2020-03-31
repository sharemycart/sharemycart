import React from 'react';

import ShoppingList from './ShoppingList';
import ShoppingItems from './ShoppingItems';

const DependentNeedsLists = ({
  authUser,
  shoppingLists,
  items
}) => (
    <ul>
      {shoppingLists.map(shoppingList => (
        <div><h3>{shoppingList.name}</h3>
          <ShoppingList
            authUser={authUser}
            key={shoppingList.uid}
            shoppingList={shoppingList}
          />
          <p>
            <strong>Bring-along-items</strong>
            <ShoppingItems
              authUser={authUser}
              shoppingItems={shoppingList.items}
            />
          </p>
        </div>
      ))}
    </ul>
  );

export default DependentNeedsLists;
