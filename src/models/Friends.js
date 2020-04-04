import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { withFirebase } from '../components/Firebase';

class Friends extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        };
    }

    async determineFriends() {
        const { firebase } = this.props;

        let friendsIds = []

        const myShoppingListsSnapshot = await firebase.myShoppingLists().get()
        myShoppingListsSnapshot.forEach(myShoppingList => {
            firebase
                .dependentNeedsListOfShoppingList(myShoppingList.uid)
                .get()
                .then((snapshot) => {
                    snapshot.forEach((needsList) => {
                        friendsIds.push(needsList.userId)
                    })
                })
        })

        const myNeedsListsSnapshot = await firebase.myNeedsLists().get()
        myNeedsListsSnapshot.then((snapshot) => {
            snapshot.forEach((needsList) => {
                friendsIds.push(needsList.shoppingListOwnerId)
            })
        })

        const friends = await Promise.all(friendsIds.map(friendId =>
            firebase
                .users()
                .doc(friendId)
                .get()
        ))

        friends.forEach(snapshot => {
            const user = snapshot.data();
            this.props.userStore.setUser(
                user.uid,
                user,
            );
        })
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.determineFriends();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render = () => (<span />)
}

export default compose(
    withFirebase,
    inject('userStore'),
    observer,
)(Friends);
