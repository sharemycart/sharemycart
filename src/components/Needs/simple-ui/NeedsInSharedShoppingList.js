import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import { inject, observer } from 'mobx-react';
import {NEEDS} from '../../../constants/routes';

class NeedsInSharedShoppingList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shoppingListId: null,
            sharedShoppingList: null,
            sharingUser: null,
            isValid: false,
            loading: true
        }
    }

    async componentDidMount() {
        const { location } = this.props;
        const { pathname } = location;
        const shoppingListId = pathname.replace('/share/', '')

        const snapshot = await this.props.firebase.list(shoppingListId).get()
        const sharedShoppingList = snapshot.data();
        const sharingUser = sharedShoppingList
            ? (await this.props.firebase.user(sharedShoppingList.userId).get()).data()
            : null

        this.setState({
            shoppingListId,
            sharedShoppingList,
            sharingUser,
            isValid: snapshot.exists,
            loading: false
        })
    }

    onCreateNeedsListForShoppingList(shoppingListId, name) {
        this.props.firebase.createNeedsListForShoppingList(shoppingListId, name)
            .then(() => {
                this.props.history.push(NEEDS)
            })
    }

    render() {
        const { loading, shoppingListId, sharingUser, isValid } = this.state;

        return (
            <div id='needs-in-shared-shopping-list'>
                {loading && <div>Loading shared shopping list...</div>}

                {!loading && !isValid && <div>The list with id {shoppingListId} does not exist</div>}

                {!loading && isValid && <div><div>you received shopping list {shoppingListId} from {sharingUser.username}</div>

                    <span>
                        <button
                            type="button"
                            onClick={() => this.onCreateNeedsListForShoppingList(shoppingListId, sharingUser.username)}
                        >
                            Add to my needs
                        </button>
                    </span>
                </div>

                }
            </div>
        )
    };
}

export default compose(
    withFirebase,
    inject('needsStore', 'sessionStore'),
    observer,
)(NeedsInSharedShoppingList);