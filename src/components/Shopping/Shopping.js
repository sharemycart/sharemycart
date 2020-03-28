import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import ShoppingLists from './ShoppingLists';
import { LIST_TYPE_SHOPPING } from '../../constants/lists';

class Shopping extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
      // limit: 50,
    };
  }

  componentDidMount() {
    if (!this.props.shoppingStore.shoppingListsArray.length) {
      this.setState({ loading: true });
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
    this.unsubscribe = this.props.firebase
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

          this.setState(Object.assign(this.state, { loading: false }));
        } else {
          this.props.shoppingStore.setShoppingLists([]);

          this.setState({ loading: false });
        }
      });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onCreateShoppingList = (event, authUser) => {
    this.props.firebase.lists().add({
      name: this.state.text,
      type: LIST_TYPE_SHOPPING,
      userId: authUser.uid,
      createdAt: this.props.firebase.fieldValue.serverTimestamp(),
    });

    this.setState({ text: '' });

    event.preventDefault();
  };

  onEditShoppingList = (shoppingList, text) => {
    const { uid, ...shoppingListSnapshot } = shoppingList;

    this.props.firebase.list(shoppingList.uid).set({
      ...shoppingListSnapshot,
      name: text,
      editedAt: this.props.firebase.fieldValue.serverTimestamp(),
    });
  };

  onRemoveShoppingList = uid => {
    this.props.firebase.list(uid).delete();
  };

  onSetCurrentShoppingList = uid => {
    this.props.firebase.currentShoppingList().get()
    .then((snapshot)=>{
      snapshot.docs.forEach((s)=>s.ref.update('isCurrent', false))
    })
    .then(()=> this.props.firebase.list(uid).update('isCurrent', true))
  }

  // onNextPage = () => {
  //   this.props.shoppingStore.setLimit(
  //     this.props.shoppingStore.limit + 5,
  //   );
  // };

  render() {
    const { shoppingStore, sessionStore } = this.props;
    const { text, loading } = this.state;
    const shoppingLists = shoppingStore.shoppingListsArray;
    // return (<div>
    //   {shoppingLists && shoppingLists.length && shoppingLists.map(s=>(<li>s.uid</li>))}
    // </div>)

    return (
      <div>
        {loading && <div>Loading ...</div>}

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
            type="text"
            value={text}
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
