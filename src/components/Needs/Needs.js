import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import NeedsLists from './NeedsLists';
import { LIST_TYPE_NEED } from '../../constants/lists';
import NeededItems from './NeededItems';

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
class Needs extends Component {
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
    if (!this.props.needsStore.needsListsArray.length) {
      this.setState({
        listsLoading: true,
        itemsLoading: true
      });
    }

    this.onListenForNeedsLists();
    this.onListenForCurrentNeedsListItems();
  }

  componentDidUpdate(props) {
    if (props.needsStore.limit !== this.props.needsStore.limit) {
      this.onListenForNeedsLists();
      this.onListenForCurrentNeedsListItems();
    }
  }

  componentWillUnmount() {
    this.unsubscribeLists();
    this.unsubscribeItems && this.unsubscribeItems();
  }

  // listeners to the database
  onListenForNeedsLists = () => {
    this.unsubscribeLists = this.props.firebase
      .myNeedsLists()
      .where('type', '==', LIST_TYPE_NEED)
      .orderBy('createdAt', 'desc')
      // .limit(this.state.limit)
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          let needsLists = [];
          snapshot.forEach(doc =>
            needsLists.push({ ...doc.data(), uid: doc.id }),
          );

          this.props.needsStore.setNeedsLists(needsLists);

          this.setState(Object.assign(this.state, { listsLoading: false }));
        } else {
          this.props.needsStore.setNeedsLists([]);

          this.setState({ listsLoading: false, itemsLoading: false });
        }

        // trigger item updates - this should actually be done implicitly, but it seems it isn't
        this.unsubscribeItems && this.unsubscribeItems();
        this.onListenForCurrentNeedsListItems()

      });
  }

  onListenForCurrentNeedsListItems = () => {
    const { currentNeedsList } = this.props.needsStore;
    if (currentNeedsList) {
      this.unsubscribeItems = this.props.firebase
        .listItems(currentNeedsList.uid)
        // .orderBy('createdAt', 'desc')
        // .limit(this.state.limit)
        .onSnapshot(snapshot => {
          if (snapshot.size) {
            let neededItems = [];
            snapshot.forEach(doc =>
              neededItems.push({ ...doc.data(), uid: doc.id }),
            );

            this.props.needsStore.setCurrentNeedsListItems(neededItems);

            this.setState(Object.assign(this.state, { itemsLoading: false }));
          } else {
            this.props.needsStore.setCurrentNeedsListItems([]);

            this.setState({ itemsLoading: false });
          }
        });
    }
  };

  // event handlers for lists
  onChangeText = event => {
    this.setState({ editingListName: event.target.value });
  };

  onCreateNeedsList = (event, authUser) => {
    event.preventDefault();

    this.props.firebase.lists().add({
      name: this.state.editingListName,
      type: LIST_TYPE_NEED,
      userId: authUser.uid,
      isCurrent: !this.props.needsStore.currentNeedsList,
      createdAt: this.props.firebase.fieldValue.serverTimestamp(),
    });

    this.setState({ editingListName: '' });
  };

  onEditNeedsList = (needsList, editingListName) => {
    const { uid, ...needsListSnapshot } = needsList;

    this.props.firebase.list(needsList.uid).set({
      ...needsListSnapshot,
      name: editingListName,
      editedAt: this.props.firebase.fieldValue.serverTimestamp(),
    });
  };

  onRemoveNeedsList = uid => {
    this.props.firebase.list(uid).delete();
  };

  onSetCurrentNeedsList = uid => {
    this.props.firebase.currentNeedsList().get()
      .then((snapshot) => {
        snapshot.docs.forEach((s) => s.ref.update('isCurrent', false))
      })
      .then(() => this.props.firebase.list(uid).update('isCurrent', true))
  }

  // event handlers for items
  onCreateItemForCurrentNeedsList = (item) => {
    const { currentNeedsList } = this.props.needsStore;
    if (currentNeedsList) {
      this.props.firebase
        .listItems(currentNeedsList.uid)
        .add(Object.assign(item, { createdAt: this.props.firebase.fieldValue.serverTimestamp() }));
    } else {
      console.error('Cannot create item for non-existing needsList');
    }
  };

  onEditNeededItem = (item) => {
    const { currentNeedsList } = this.props.needsStore;
    if (currentNeedsList) {
      this.props.firebase
        .listItem(currentNeedsList.uid, item.uid)
        .set(Object.assign(item, { editedAt: this.props.firebase.fieldValue.serverTimestamp() }));
    } else {
      console.error('Cannot edit item in non-existing needsList');
    }
  };

  onRemoveNeededItem = (uid) => {
    const { currentNeedsList } = this.props.needsStore;
    if (currentNeedsList) {
      this.props.firebase
        .listItem(currentNeedsList.uid, uid)
        .delete()
    } else {
      console.error('Cannot remove item from non-existing needsList');
    }
  };

  // onNextPage = () => {
  //   this.props.needsStore.setLimit(
  //     this.props.needsStore.limit + 5,
  //   );
  // };

  render() {
    const { needsStore, sessionStore } = this.props;
    const { editingListName, listsLoading, itemsLoading } = this.state;
    const needsLists = needsStore.needsListsArray;
    const currentNeedsListItems = needsStore.currentNeedsListItemsArray;

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
            <button type="submit">Send</button>
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
