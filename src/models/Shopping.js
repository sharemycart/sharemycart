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
 * 
 */
class Shopping extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listsLoading: false,
      itemsLoading: false,
    };
  }

  _tryInitialization() {
    if (this.props.sessionStore.dbAuthenticated && !this.unsubscribeLists) {
      this.ensureExistingCurrentShoppingList()
      this.onListenForShoppingLists();
      this.onListenForCurrentShoppingListItems();
    }
  }

  // React lifecycle methods

  componentDidMount() {
    if (!this.props.shoppingStore.shoppingListsArray.length) {
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
        let currentShoppingListId = null;

        this.props.shoppingStore.setInitializationDone(true);

        if (snapshot.size) {
          let shoppingLists = [];
          snapshot.forEach(doc => {
            const shoppingList = doc.data();
            shoppingLists.push({ ...shoppingList, uid: doc.id })
            if (shoppingList.isCurrent) {
              currentShoppingListId = doc.id;
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
        this.onListenForCurrentShoppingListItems(currentShoppingListId)

        // register for dependent needs list items
        this.unsubscribeDependentNeedsLists && this.unsubscribeDependentNeedsLists()
        this.unsubscribeAllDependentNeedsListItems()
        this.onListenForDependentNeedsLists(currentShoppingListId)

      });
  }

  onListenForCurrentShoppingListItems = (currentShoppingListId) => {
    this.unsubscribeItems = this.props.firebase
      .listItems(currentShoppingListId)
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          let shoppingItems = [];
          snapshot.forEach(doc =>
            shoppingItems.push({ ...doc.data(), uid: doc.id, parentId: doc.ref.parent.parent.id  }),
          );

          this.props.shoppingStore.setCurrentShoppingListItems(shoppingItems);

          this.setState({ itemsLoading: false });
        } else {
          this.props.shoppingStore.setCurrentShoppingListItems([]);

          this.setState({ itemsLoading: false });
        }
      });
  };

  onListenForDependentNeedsLists = (originShoppingListId) => {
    this.unsubscribeDependentNeedsLists = this.props.firebase
      .dependentNeedsListOfShoppingList(originShoppingListId)
      .onSnapshot(snapshot => {
        // remove observers for the lists items, they are going to be re-built for each needs list
        this.unsubscribeAllDependentNeedsListItems();

        if (snapshot.size) {
          let dependentNeedsLists = [];
          this.unsubscribeDependentNeedsListsItems = [];

          snapshot.forEach(doc => {
            const needsList = doc.data();

            dependentNeedsLists.push({ ...needsList, uid: doc.id })

            // for each of those needs lists, we also need to setup a listener for the items
            this.onListenForDependentNeedsListsItems(doc.id);

            // The owner of the needs list is a relevant user. 
            // Make sure we've got his information buffered
            // we don't need reactivity for that in the first step to keep it simple
            const { userId } = needsList;
            if (!this.props.userStore.users[userId]) {
              this.props.firebase.user(userId).get()
                .then(snapshot => {
                  const owner = snapshot.data()
                  this.props.userStore.setUser(snapshot.id, owner)
                })
            }
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

  onListenForDependentNeedsListsItems = (needsListId) => {
    this.unsubscribeDependentNeedsListsItems.push(
      this.props.firebase
        .listItems(needsListId)
        // .orderBy('createdAt', 'desc')
        // .limit(this.state.limit)
        .onSnapshot(snapshot => {
          let dependentNeedsListsItems = [];
          snapshot.forEach(doc =>
            dependentNeedsListsItems.push({ ...doc.data(), uid: doc.id, parentId: doc.ref.parent.parent.id }),
          );
          this.props.shoppingStore.setDependentNeedsListItems(needsListId, dependentNeedsListsItems);
        })
    );
  }

  // event handlers for lists
  onChangeText = event => {
    this.setState({ editingListName: event.target.value });
  };

  handleCreateShoppingList = (event) => {
    event.preventDefault();

    this.props.firebase.createShoppingList({
      name: this.state.editingListName
    });

    this.setState({ editingListName: '' });
  };

  onCreateShoppingList = (name) => {
    this.props.firebase.createShoppingList({
      name
    });
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

  onReorderItems = (listId, items, order) => {
    this.props.firebase.setItemsOrder(listId, items, order)
  }

  onOpenShopping = shoppingList =>{
    this.props.firebase.openShopping(shoppingList)
  }

  onGoShopping = shoppingList =>{
    this.props.firebase.goShopping(shoppingList)
  }

  onFinishShopping = shoppingList =>{
    this.props.firebase.finishShopping(shoppingList)
  }

  // event handlers for items
  onCreateItemForCurrentShoppingList = (item) => {
    const { currentShoppingList } = this.props.shoppingStore;
    if (currentShoppingList) {
      return this.props.firebase.createItem(currentShoppingList.uid, item)
    } else {
      console.error('Cannot create item for non-existing shoppingList');
      return new Promise(() => null)
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

  onShopShoppingItem = (listId, uid, shopped = true) => {
      this.props.firebase.shopItem(listId, uid, shopped)
  };

  // helpers
  ensureExistingCurrentShoppingList = async () => {
    const currentShoppingListSnapshot = await this.props.firebase.myCurrentShoppingList().get()
    if (!currentShoppingListSnapshot.size) {
      return this.props.firebase.createShoppingList({ name: '' })
    }
  }
}

export default Shopping;