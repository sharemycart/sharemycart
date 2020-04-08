import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import ShoppingList from './ShoppingList';

import ShareListFab from './Share';
import LoadingAnimation from '../../Reusables/ionic/LoadingAnimation';
import { Switch, Route, withRouter } from 'react-router';
import { GO_SHOPPING } from '../../../constants/routes';
import { ITEM_TYPE_IN_SHOPPING, ITEM_TYPE_SHOPPING } from '../../../constants/items';

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
      currentDependentNeedsListsArray: currentDependentNeedsLists,
      initializationDone,
    } = shoppingStore;

    const mode = this.props.location.pathname === GO_SHOPPING
                  ? ITEM_TYPE_IN_SHOPPING
                  : ITEM_TYPE_SHOPPING

    if( !initializationDone ) return <LoadingAnimation loading={initializationDone} />

    return (
      currentShoppingList && 
      <>
        <ShoppingList
          authUser={sessionStore.authUser}
          list={currentShoppingList}
          items={currentShoppingListItems}
          mode={mode}
          dependentNeedLists={currentDependentNeedsLists}
          onEditList={this.props.model.onEditShoppingList}
          onCreateItem={this.props.model.onCreateItemForCurrentShoppingList}
          onEditItem={this.props.model.onEditShoppingItem}
          onShopItem={this.props.model.onShopShoppingItem}
          onDeleteItem={this.props.model.onRemoveShoppingItem}
          onReorderItems={this.props.model.onReorderItems}
          editMode={this.props.editMode}
          addSaveEditHandler={this.props.addSaveEditHandler}
        />
        <ShareListFab shoppingList={currentShoppingList} />
      </>
    );
  }
}

export default compose(
  withRouter,
  inject('shoppingStore', 'sessionStore'),
  observer,
)(Shopping);
