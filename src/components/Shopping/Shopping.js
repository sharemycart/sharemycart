import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import ShoppingLists from './ShoppingLists';
import { LIST_TYPE_SHOPPING } from '../../constants/lists';
import ShoppingItems from './ShoppingItems';

/**
 * This component represent the complete state of the needs section of the app.
 * As such, it manages as *all the state*, all subordinate components have to be stateless!
 * This includes both, ephemeral state as well as application state:
 * - Application state is managed in th Stores.
 *   This component reads and writes to the store, based upon the handlers it sets-up
 *   It passes the application state (not the Stores themselves!) down to subordinate components
 * - Ephemeral state is managed in the `state` property of the component.
 *   Since all subordinate components are stateless with respect to applications state,
 *   subordinate components are being passed functions to manipulate it.
 *   This might get messy as the application grows and might be refactored, but it's not that simple to do.
 */
class Shopping extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingListName: '',
      listsLoading: false,
      itemsLoading: false,
      // limit: 50,
    };
  }

  // React lifecycle methods
  componentDidMount() {
    if (!this.props.shoppingStore.shoppingListsArray.length) {
      this.setState({
        listsLoading: true,
        itemsLoading: true
      });
    }

    this.onListenForShoppingLists();
    this.onListenForCurrentShoppingListItems();
  }

  componentDidUpdate(props) {
    if (props.shoppingStore.limit !== this.props.shoppingStore.limit) {
      this.onListenForShoppingLists();
      this.onListenForCurrentShoppingListItems();
    }
  }

  componentWillUnmount() {
    this.unsubscribeLists();
    this.unsubscribeItems && this.unsubscribeItems();
  }

  // listeners to the database
  onListenForShoppingLists = () => {
    this.unsubscribeLists = this.props.firebase
      .myShoppingLists()
      .orderBy('createdAt', 'desc')
      // .limit(this.state.limit)
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          let shoppingLists = [];
          snapshot.forEach(doc =>
            shoppingLists.push({ ...doc.data(), uid: doc.id }),
          );

          this.props.shoppingStore.setShoppingLists(shoppingLists);

          this.setState(Object.assign(this.state, { listsLoading: false }));
        } else {
          this.props.shoppingStore.setShoppingLists([]);

          this.setState({ listsLoading: false, itemsLoading: false });
        }

        // trigger item updates - this should actually be done implicitly, but it seems it isn't
        this.unsubscribeItems && this.unsubscribeItems();
        this.onListenForCurrentShoppingListItems()

      });
  }

  onListenForCurrentShoppingListItems = () => {
    const { currentShoppingList } = this.props.shoppingStore;
    if (currentShoppingList) {
      this.unsubscribeItems = this.props.firebase
        .listItems(currentShoppingList.uid)
        // .orderBy('createdAt', 'desc')
        // .limit(this.state.limit)
        .onSnapshot(snapshot => {
          if (snapshot.size) {
            let shoppingItems = [];
            snapshot.forEach(doc =>
              shoppingItems.push({ ...doc.data(), uid: doc.id }),
            );

            this.props.shoppingStore.setCurrentShoppingListItems(shoppingItems);

            this.setState(Object.assign(this.state, { itemsLoading: false }));
          } else {
            this.props.shoppingStore.setCurrentShoppingListItems([]);

            this.setState({ itemsLoading: false });
          }
        });
    }
  };

  // event handlers for lists
  onChangeText = event => {
    this.setState({ editingListName: event.target.value });
  };

  onCreateShoppingList = (event, authUser) => {
    event.preventDefault();

    this.props.firebase.lists().add({
      name: this.state.editingListName,
      type: LIST_TYPE_SHOPPING,
      userId: authUser.uid,
      isCurrent: !this.props.shoppingStore.currentShoppingList,
      createdAt: this.props.firebase.fieldValue.serverTimestamp(),
    });

    this.setState({ editingListName: '' });
  };

  onEditShoppingList = (shoppingList, editingListName) => {
    const { uid, ...shoppingListSnapshot } = shoppingList;

    this.props.firebase.list(shoppingList.uid).set({
      ...shoppingListSnapshot,
      name: editingListName,
      editedAt: this.props.firebase.fieldValue.serverTimestamp(),
    });
  };

  onRemoveShoppingList = uid => {
    this.props.firebase.list(uid).delete();
  };

  onSetCurrentShoppingList = uid => {
    this.props.firebase.currentShoppingList().get()
      .then((snapshot) => {
        snapshot.docs.forEach((s) => s.ref.update('isCurrent', false))
      })
      .then(() => this.props.firebase.list(uid).update('isCurrent', true))
  }

  // event handlers for items
  onCreateItemForCurrentShoppingList = (item) => {
    const { currentShoppingList } = this.props.shoppingStore;
    if (currentShoppingList) {
      this.props.firebase
        .listItems(currentShoppingList.uid)
        .add(Object.assign(item, { createdAt: this.props.firebase.fieldValue.serverTimestamp() }));
    } else {
      console.error('Cannot create item for non-existing shoppingList');
    }
  };

  onEditShoppingItem = (item) => {
    const { currentShoppingList } = this.props.shoppingStore;
    if (currentShoppingList) {
      this.props.firebase
        .listItem(currentShoppingList.uid, item.uid)
        .set(Object.assign(item, { editedAt: this.props.firebase.fieldValue.serverTimestamp() }));
    } else {
      console.error('Cannot edit item in non-existing shoppingList');
    }
  };

  onRemoveShoppingItem = (uid) => {
    const { currentShoppingList } = this.props.shoppingStore;
    if (currentShoppingList) {
      this.props.firebase
        .listItem(currentShoppingList.uid, uid)
        .delete()
    } else {
      console.error('Cannot remove item from non-existing shoppingList');
    }
  };

  // onNextPage = () => {
  //   this.props.shoppingStore.setLimit(
  //     this.props.shoppingStore.limit + 5,
  //   );
  // };

  render() {
    const { shoppingStore, sessionStore } = this.props;
    const { editingListName, listsLoading, itemsLoading } = this.state;
    const shoppingLists = shoppingStore.shoppingListsArray;
    const currentShoppingListItems = shoppingStore.currentShoppingListItemsArray;

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
            <button type="submit">Send</button>
          </form>
        </div>
        <div id='current-shopping-list-items'>
          <ShoppingItems
            authUser={sessionStore.authUser}
            shoppingItems={currentShoppingListItems}
            onEditShoppingItem={this.onEditShoppingItem}
            onRemoveShoppingItem={this.onRemoveShoppingItem}
            onCreateShoppingItem={this.onCreateItemForCurrentShoppingList}
          />
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
