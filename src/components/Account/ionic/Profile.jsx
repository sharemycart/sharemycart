import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { IonCardHeader, IonCard, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import UserProfileImg from '../../Reusables/ionic/UserProfileImg';

const Profile = (props) => {
    const user = props.sessionStore.authUser;
    return (
        <IonCard style={{
            padding: '30px',
        }}>
            <IonCardHeader class="ion-text-center">
                <UserProfileImg user={user} size={200} />
                <IonCardSubtitle >{user.username}</IonCardSubtitle>
                <IonCardTitle>{user.email}</IonCardTitle>
            </IonCardHeader>
        </IonCard>
    )
}

export default compose(
    inject('sessionStore'),
    observer,
)(Profile);