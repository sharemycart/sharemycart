import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import { inject, observer } from 'mobx-react';
import { NEEDS } from '../../../constants/routes';

import { IonButton, IonContent, IonToolbar, IonPage, IonHeader, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonFooter } from '@ionic/react';

import { Trans } from 'react-i18next';

import './page.css'
import LoadingAnimation from '../../Reusables/ionic/LoadingAnimation';
import UserProfileImg from '../../Reusables/ionic/UserProfileImg';

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
            if (loading) return <LoadingAnimation loading={loading}/>
            if (!loading && !isValid) return <div>The list with id {shoppingListId} does not exist</div>
            if (!loading && isValid) return (
                <>
                    <IonCard style={{
                        padding: '30px',
                    }}>
                        <IonCardHeader class="ion-text-center">
                            <UserProfileImg user={sharingUser} size={150} />
                            <IonCardTitle>{sharingUser.username}&nbsp;({sharingUser.email})</IonCardTitle>
                            <IonCardSubtitle><Trans>has shared a shopping list with you</Trans></IonCardSubtitle>
                        </IonCardHeader>
                    </IonCard>
                    <IonFooter>
                        <CreateNeedsListButton
                          {...props}
                          shoppingListId={shoppingListId}
                          sharingUser={sharingUser}
                        />
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
