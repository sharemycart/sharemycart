import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import { inject, observer } from 'mobx-react';
import { NEEDS } from '../../../constants/routes';

import { IonLoading, IonButton, IonContent, IonFooter, IonToolbar, IonPage, IonHeader, IonTitle, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import Avatar from '../../Reusables/ionic/Avatar';

import { Trans } from 'react-i18next';

import './page.css'

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

        const Content = (props) => {
            if (loading) return (
                <IonLoading
                    isOpen={loading}
                    message={'Please wait...'}
                />)
            if (!loading && !isValid) return <div>The list with id {shoppingListId} does not exist</div>
            if (!loading && isValid) return (
                <>
                    <div style={{
                        height: "300px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <IonCard style={{
                            padding: '30px',
                        }}>

                            <div>
                                <Avatar user={sharingUser} />
                            </div>
                            <div>
                                <IonCardHeader class="ion-text-center">
                                    <IonCardTitle>{sharingUser.username}&nbsp;({sharingUser.email})&nbsp;<Trans>has shared a shopping list with you</Trans></IonCardTitle>
                                </IonCardHeader>
                            </div>
                        </IonCard>
                    </div>
                    <IonFooter>
                        <IonToolbar>
                            <CreateNeedsListButton
                                {...props}
                                shoppingListId={shoppingListId}
                                sharingUser={sharingUser}
                            />
                        </IonToolbar>
                    </IonFooter>
                </>
            )
            return null
        }

        return (
            <>
                <IonPage>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle><Trans>Shared</Trans></IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonHeader collapse="condense">
                            <IonToolbar>
                                <IonTitle size="large"><Trans>Shared</Trans></IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        <Content
                            {...this.props}
                            onCreateNeedsListForShoppingList={this.onCreateNeedsListForShoppingList.bind(this)}
                        />
                    </IonContent>
                </IonPage>
            </>
        )
    };
}

const CreateNeedsListButton = ({ shoppingListId, sharingUser, onCreateNeedsListForShoppingList }) => (
    <IonButton
        type="button"
        expand="full"
        onClick={() => onCreateNeedsListForShoppingList(shoppingListId, sharingUser.username)}
    >
        <Trans>Open shared shopping list</Trans>
    </IonButton>
)

export default compose(
    withFirebase,
    inject('needsStore', 'sessionStore'),
    observer,
)(NeedsInSharedShoppingList);