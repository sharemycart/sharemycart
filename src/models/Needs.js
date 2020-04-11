import { Component } from 'react';

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
 * 
 * This component shall not have a representation. However, it can serve as base-class 
 * for visualizing components.
 */
class Needs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listsLoading: false,
      itemsLoading: false,
    };
  }

  _tryInitialization() {
    if (this.props.sessionStore.dbAuthenticated && !this.unsubscribeLists) {
      this.onListenForNeedsLists();
    }
  }

  // React lifecycle methods

  componentDidMount() {
    if (!this.props.needsStore.needsListsArray.length) {
      this.setState({
        listsLoading: true,
        itemsLoading: true
      });
    }
    this._tryInitialization()
  }

  componentDidUpdate() {
    this._tryInitialization()
  }

  componentWillUnmount() {
    this.unregisterAllListeners();
  }

  unregisterAllListeners() {
    this.unsubscribeLists && this.unsubscribeLists();
    this.unsubscribeItems && this.unsubscribeItems();
    this.unsubscribeOriginShoppingList && this.unsubscribeOriginShoppingList()
    this.unsubscribeOriginShoppingListItems && this.unsubscribeOriginShoppingListItems()
  }

  // listeners to the database
  onListenForNeedsLists = () => {
    this.unsubscribeLists = this.props.firebase
      .myNeedsLists()
      .orderBy('createdAt', 'desc')
      // .limit(this.state.limit)
      .onSnapshot(snapshot => {
        let currentNeedsListId = null;
        let currentOriginShoppingListId = null;

        this.props.needsStore.setInitializationDone(true);

        if (snapshot.size) {
          let needsLists = [];
          snapshot.forEach(doc => {
            const needsList = doc.data();
            needsLists.push({ ...needsList, uid: doc.id });
            if (needsList.isCurrent && needsList.shoppingListId) {
              currentNeedsListId = doc.id;
              currentOriginShoppingListId = needsList.shoppingListId;
            }

            // The owner of the shopping list for which the needs list 
            // has been created is a relevant user. 
            // Make sure we've got his information buffered
            // we don't need reactivity for that in the first step to keep it simple
            const { shoppingListOwnerId } = needsList;
            if (shoppingListOwnerId && !this.props.userStore.users[shoppingListOwnerId]) {
              this.props.firebase.user(shoppingListOwnerId).get()
                .then(snapshot => {
                  const owner = snapshot.data()
                  this.props.userStore.setUser(snapshot.id, owner)
                })
            }
          }
          );

          this.props.needsStore.setNeedsLists(needsLists);

          this.setState(Object.assign(this.state, { listsLoading: false }));
        } else {
          this.props.needsStore.setNeedsLists([]);

          this.setState({ listsLoading: false, itemsLoading: false });
        }

        // react on item updates - this should actually be done implicitly, but it seems it isn't
        this.unsubscribeItems && this.unsubscribeItems();
        currentNeedsListId && this.onListenForCurrentNeedsListItems(currentNeedsListId)

        //* react on changes of the origin shopping list
        //  remove obsolete listeners first (if exist)
        this.unsubscribeOriginShoppingList && this.unsubscribeOriginShoppingList()
        this.unsubscribeOriginShoppingListItems && this.unsubscribeOriginShoppingListItems()

        // register for changes in the origin shopping list
        if (currentOriginShoppingListId) {
          this.unsubscribeOriginShoppingList = this.onListenForOriginShoppingList(currentOriginShoppingListId)
        } else {
          this.clearOriginShoppingListInStore()
        }

      });
  }

  onListenForCurrentNeedsListItems = uid => {
    this.unsubscribeItems = this.props.firebase
      .listItems(uid)
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          let neededItems = [];
          snapshot.forEach(doc =>
            neededItems.push({ ...doc.data(), uid: doc.id, parentId: doc.ref.parent.parent.id  }),
          );

          this.props.needsStore.setCurrentNeedsListItems(neededItems);

          this.setState(Object.assign(this.state, { itemsLoading: false }));
        } else {
          this.props.needsStore.setCurrentNeedsListItems([]);

          this.setState({ itemsLoading: false });
        }
      });
  };

  onListenForOriginShoppingList = (uid) => {
    this.unsubscribeOriginShoppingList = this.props.firebase
      .list(uid)
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
          const shoppingList = snapshot.data();
          this.props.needsStore.setCurrentOriginShoppingList(shoppingList);

          this.unsubscribeOriginShoppingListItems && this.unsubscribeOriginShoppingListItems();
          this.onListenForOriginShoppingListItems(uid);

        } else {
          this.clearOriginShoppingListInStore();
        }
      });
  }

  onListenForOriginShoppingListItems = (originListId) => {
    this.unsubscribeOriginShoppingListItems = this.props.firebase
      .listItems(originListId)
      // .orderBy('createdAt', 'desc')
      // .limit(this.state.limit)
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          let OriginShoppingListItems = [];
          snapshot.forEach(doc =>
            OriginShoppingListItems.push({ ...doc.data(), uid: doc.id }),
          );

          this.props.needsStore.setCurrentOriginShoppingListItems(OriginShoppingListItems);

        } else {
          this.props.needsStore.setCurrentOriginShoppingListItems([]);
        }
      });
  };

  clearOriginShoppingListInStore() {
    this.props.needsStore.setCurrentOriginShoppingList(null);
    this.props.needsStore.setCurrentOriginShoppingListItems([]);
  }

  // event handlers for lists
  onChangeText = event => {
    this.setState({ editingListName: event.target.value });
  };

  onCreateNeedsList = (event, authUser) => {
    event.preventDefault();

    this.props.firebase.createNeedsList({
      name: this.state.editingListName,
    });

    this.setState({ editingListName: '' });
  };

  onEditNeedsList = (needsList, editingListName) => {
    const { uid, ...needsListSnapshot } = needsList;

    this.props.firebase.editList(needsList.uid, {
      ...needsListSnapshot,
      name: editingListName,
    });
  };

  onRemoveNeedsList = uid => {
    this.props.firebase.deleteList(uid);
  };

  onSetCurrentNeedsList = uid => {
    this.props.firebase.setCurrentNeedsList(uid);
  }

  // event handlers for items
  onCreateItemForCurrentNeedsList = (item) => {
    const { currentNeedsList } = this.props.needsStore;
    if (currentNeedsList) {
      this.props.firebase.addNeededItemFromShoppingListItem(currentNeedsList.uid, item);
    } else {
      console.error('Cannot create item for non-existing needsList');
    }
  };

  onEditNeededItem = (item) => {
    const { currentNeedsList } = this.props.needsStore;
    if (currentNeedsList) {
      this.props.firebase.editItem(currentNeedsList.uid, item)
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

  onAddFromShoppingListItem = (item) => {
    const { currentNeedsList } = this.props.needsStore;
    if (currentNeedsList) {
      this.props.firebase.addNeededItemFromShoppingListItem(currentNeedsList.uid, Object.assign(item, { quantity: 0 }))
    } else {
      console.error('Cannot add item to non-existing needsList');
    }
  }
}

export default Needs;