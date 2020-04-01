import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';

import NeedsModel from '../../../models/Needs';
import NeedsList from './NeedsList';
import { ITEM_TYPE_NEED, ITEM_TYPE_POTENTIAL_NEED } from '../../../constants/items';
class Needs extends NeedsModel {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      editingListName: '',
    });
  }

  render() {
    const { needsStore, sessionStore } = this.props;
    const { editingListName, listsLoading, itemsLoading } = this.state;
    const {
      currentNeedsList,
      potentiallyNeededItemsArray: potentiallyNeededItems,
      currentNeedsListItemsArray: currentNeedsListItems,
      currentOriginShoppingList,
    } = needsStore;

    return (
      <>
      {/* Needs */}
        {!(listsLoading || itemsLoading) && currentNeedsList &&
          <NeedsList
            authUser={sessionStore.authUser}
            list={currentOriginShoppingList}
            items={currentNeedsListItems}
            onEditItem={this.onEditNeedsList}
            onCreateItem={this.onCreateItemForCurrentNeedsList}
            onEditItem={this.onEditNeededItem}
            onDeleteItem={this.onRemoveNeededItem}
            ownList={true}
            mode={ITEM_TYPE_NEED}
          />
        }

        {/* Potentially needed */}
        {!(listsLoading || itemsLoading) && currentOriginShoppingList &&
          <NeedsList
            authUser={sessionStore.authUser}
            list={currentOriginShoppingList}
            items={potentiallyNeededItems}
            onEditItem={this.onEditNeedsList}
            onCreateItem={this.onCreateItemForCurrentNeedsList}
            onEditItem={this.onEditNeededItem}
            onDeleteItem={this.onRemoveNeededItem}
            ownList={false}
            mode={ITEM_TYPE_POTENTIAL_NEED}
          />
        }
      </>
    );
  }
}

export default compose(
  withFirebase,
  inject('needsStore', 'sessionStore'),
  observer,
)(Needs);
