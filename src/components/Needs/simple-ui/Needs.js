import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';
import NeedsLists from './NeedsLists';
import NeededItems from './NeededItems';

import NeedsModel from '../../../models/Needs';
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
    const needsLists = needsStore.needsListsArray;
    const {
      potentiallyNeededItemsArray: potentiallyNeededItems,
      currentNeedsListItemsArray: currentNeedsListItems,
      currentOriginShoppingList,
    } = needsStore;

    return (
      <div>
        <div id='needs-lists'>
          {listsLoading && <div>Loading needs lists...</div>}
          {itemsLoading && <div>Loading items...</div>}

          {needsLists && (
            <NeedsLists
              authUser={sessionStore.authUser}
              needsLists={needsLists}
              onEditNeedsList={this.onEditNeedsList}
              onRemoveNeedsList={this.onRemoveNeedsList}
              onSetCurrentNeedsList={this.onSetCurrentNeedsList}
            />
          )}

          {!needsLists && <div>There are no needsLists ...</div>}

          <form
            onSubmit={event =>
              this.onCreateNeedsList(event, sessionStore.authUser)
            }
          >
            <input
              type="editingListName"
              value={editingListName}
              onChange={this.onChangeText}
            />
            <button type="submit">create needs list</button>
          </form>
        </div>
        <div id='current-needs-list-items'>
          <h2>Items of current needs list</h2>
          <NeededItems
            authUser={sessionStore.authUser}
            neededItems={currentNeedsListItems}
            onEditNeededItem={this.onEditNeededItem}
            onRemoveNeededItem={this.onRemoveNeededItem}
            onCreateNeededItem={this.onCreateItemForCurrentNeedsList}
          />

          <h2>Potentially needed</h2>
          <NeededItems
            authUser={sessionStore.authUser}
            neededItems={potentiallyNeededItems}
            originShoppingList={currentOriginShoppingList}
            onEditNeededItem={this.onEditNeededItem}
            onRemoveNeededItem={this.onRemoveNeededItem}
            onCreateNeededItem={this.onCreateItemForCurrentNeedsList}
            onAddFromShoppingListItem={this.onAddFromShoppingListItem}
          />
        </div>
      </div>
    );
  }
}

export default compose(
  withFirebase,
  inject('needsStore', 'sessionStore'),
  observer,
)(Needs);
