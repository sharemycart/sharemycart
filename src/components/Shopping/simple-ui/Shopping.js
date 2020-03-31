import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';
import ShoppingLists from './ShoppingLists';
import ShoppingItems from './ShoppingItems';
import DependentNeedsLists from './DependentNeedsLists';

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
    this.unsubscribeLists && this.unsubscribeLists();
    this.unsubscribeItems && this.unsubscribeItems();
    this.unsubscribeDependentNeedsLists && this.unsubscribeDependentNeedsLists();
    this.unsubscribeAllDependentNeedsListItems();
  }

  // listeners to the database
  onListenForShoppingLists = () => {
    this.unsubscribeLists = this.props.firebase
      .myShoppingLists()
      .orderBy('createdAt', 'desc')
      // .limit(this.state.limit)
      .onSnapshot(snapshot => {
        let currentShoppingListUid = null;
        if (snapshot.size) {
          let shoppingLists = [];
          snapshot.forEach(doc => {
            const shoppingList = doc.data();
            shoppingLists.push({ ...shoppingList, uid: doc.id })
            if (shoppingList.isCurrent) {
              currentShoppingListUid = doc.id;
            }
          });

          this.props.shoppingStore.setShoppingLists(shoppingLists);

          this.setState(Object.assign(this.state, { listsLoading: false }));
        } else {
          this.props.shoppingStore.setShoppingLists([]);

          this.setState({ listsLoading: false, itemsLoading: false });
        }

        // register for item updates - this should actually be done implicitly, but it seems it isn't
        this.unsubscribeItems && this.unsubscribeItems();
        this.onListenForCurrentShoppingListItems(currentShoppingListUid)

        // register for dependent needs list items
        this.unsubscribeDependentNeedsLists && this.unsubscribeDependentNeedsLists()
        this.unsubscribeAllDependentNeedsListItems()
        this.onListenForDependentNeedsLists(currentShoppingListUid)

      });
  }

  onListenForCurrentShoppingListItems = (currentShoppingListUid) => {
    this.unsubscribeItems = this.props.firebase
      .listItems(currentShoppingListUid)
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
  };

  onListenForDependentNeedsLists = (originShoppingListUid) => {
    this.unsubscribeDependentNeedsLists = this.props.firebase
      .dependentNeedsListOfShoppingList(originShoppingListUid)
      .onSnapshot(snapshot => {
        // remove observers for the lists items, they are going to be re-built for each needs list
        this.unsubscribeAllDependentNeedsListItems();

        if (snapshot.size) {
          let dependentNeedsLists = [];
          this.unsubscribeDependentNeedsListsItems = [];

          snapshot.forEach(doc => {
            dependentNeedsLists.push({ ...doc.data(), uid: doc.id })

            // for each of those needs lists, we also need to setup a listener for the items
            this.onListenForDependentNeedsListsItems(doc.id);
          }
          );

          this.props.shoppingStore.setCurrentDependentNeedsLists(dependentNeedsLists);

        } else {
          this.props.shoppingStore.setCurrentDependentNeedsLists([]);
        }
      });
  }

  unsubscribeAllDependentNeedsListItems() {
    this.unsubscribeDependentNeedsListsItems && this.unsubscribeDependentNeedsListsItems.length
      && this.unsubscribeDependentNeedsListsItems.forEach(handler => handler());
  }

  onListenForDependentNeedsListsItems = (needsListUid) => {
    this.unsubscribeDependentNeedsListsItems.push(
      this.props.firebase
        .listItems(needsListUid)
        // .orderBy('createdAt', 'desc')
        // .limit(this.state.limit)
        .onSnapshot(snapshot => {
          let dependentNeedsListsItems = [];
          snapshot.forEach(doc =>
            dependentNeedsListsItems.push({ ...doc.data(), uid: doc.id }),
          );
          this.props.shoppingStore.setDependentNeedsListItems(needsListUid, dependentNeedsListsItems);
        })
    );
  }

  // event handlers for lists
  onChangeText = event => {
    this.setState({ editingListName: event.target.value });
  };

  onCreateShoppingList = (event) => {
    event.preventDefault();

    this.props.firebase.createShoppingList({
      name: this.state.editingListName
    });

    this.setState({ editingListName: '' });
  };

  onEditShoppingList = (shoppingList, editingListName) => {
    const { uid, ...shoppingListSnapshot } = shoppingList;

    this.props.firebase.editList(shoppingList.uid, {
      ...shoppingListSnapshot,
      name: editingListName,
    });
  };

  onRemoveShoppingList = uid => {
    this.props.firebase.deleteList(uid);
  };

  onSetCurrentShoppingList = uid => {
    this.props.firebase.setCurrentShoppingList(uid);
  }

  // event handlers for items
  onCreateItemForCurrentShoppingList = (item) => {
    const { currentShoppingList } = this.props.shoppingStore;
    if (currentShoppingList) {
      this.props.firebase.createItem(currentShoppingList.uid, item)
    } else {
      console.error('Cannot create item for non-existing shoppingList');
    }
  };

  onEditShoppingItem = (item) => {
    const { currentShoppingList } = this.props.shoppingStore;
    if (currentShoppingList) {
      this.props.firebase.editItem(currentShoppingList.uid, item)
    } else {
      console.error('Cannot edit item in non-existing shoppingList');
    }
  };

  onRemoveShoppingItem = (uid) => {
    const { currentShoppingList } = this.props.shoppingStore;
    if (currentShoppingList) {
      this.props.firebase.deleteItem(currentShoppingList.uid, uid)
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
