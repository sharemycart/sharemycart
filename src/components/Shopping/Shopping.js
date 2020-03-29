import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import ShoppingLists from './ShoppingLists';
import { LIST_TYPE_SHOPPING } from '../../constants/lists';

/**
 * This component represent the complete state of the shopping section of the app.
 * As such, it manages as *all the state*, all subordinate components have to be stateless!
 * This includes both, ephemeral state as well as application state:
 * - Application state is managed in th Stores.
 *   This component reads and writes to the store, based upon the handlers it sets-up
 *   It passes the application state (not the Stores themselves!) down to subordinate components
 * - Ephemeral state is managed in the `state` property of the component.
 *   Since all subordinate components are stateless, this includes e. g. buffers for all inputs
 *   of subordinate components as well as the functions to manipulate them
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

  componentDidMount() {
    if (!this.props.shoppingStore.shoppingListsArray.length) {
      this.setState({
        listsLoading: true,
        itemsLoading: true
      });
    }

    this.onListenForShoppingLists();
    // this.onListenForShoppingListItems();
  }

  componentDidUpdate(props) {
    if (props.shoppingStore.limit !== this.props.shoppingStore.limit) {
      this.onListenForShoppingLists();
    }
  }

  onListenForShoppingLists = () => {
    this.unsubscribeLists = this.props.firebase
      .lists()
      .where('type', '==', LIST_TYPE_SHOPPING)
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

          this.setState({ listsLoading: false });
        }
      });
  }

  onListenForCurrentShoppingListItems = () => {
    if (this.props.shoppingStore.currentShoppingList) {
      this.unsubscribeItems = this.props.firebase
        .listItems(this.props.shoppingStore.currentShoppingList.uid)
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

  componentWillUnmount() {
    this.unsubscribeLists();
    this.unsubscribeItems && this.unsubscribeItems();
  }

  onChangeText = event => {
    this.setState({ editingListName: event.target.value });
  };

  onCreateShoppingList = (event, authUser) => {
    this.props.firebase.lists().add({
      name: this.state.editingListName,
      type: LIST_TYPE_SHOPPING,
      userId: authUser.uid,
      createdAt: this.props.firebase.fieldValue.serverTimestamp(),
    });

    this.setState({ editingListName: '' });

    event.preventDefault();
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

  // onNextPage = () => {
  //   this.props.shoppingStore.setLimit(
  //     this.props.shoppingStore.limit + 5,
  //   );
  // };

  render() {
    const { shoppingStore, sessionStore } = this.props;
    const { editingListName, listsLoading } = this.state;
    const shoppingLists = shoppingStore.shoppingListsArray;

    return (
      <div>
        {listsLoading && <div>Loading ...</div>}

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
    );
  }
}

export default compose(
  withFirebase,
  inject('shoppingStore', 'sessionStore'),
  observer,
)(Shopping);
