import React from 'react';

import ShoppingList from './ShoppingList';

const ShoppingLists = ({
  authUser,
  shoppingLists,
  onEditShoppingList,
  onRemoveShoppingList,
  onSetCurrentShoppingList,
}) => (
  <ul>
    {shoppingLists.map(shoppingList => (
      <ShoppingList
        authUser={authUser}
        key={shoppingList.uid}
        shoppingList={shoppingList}
        onEditShoppingList={onEditShoppingList}
        onRemoveShoppingList={onRemoveShoppingList}
        onSetCurrentShoppingList={onSetCurrentShoppingList}
      />
    ))}
  </ul>
);

export default ShoppingLists;
