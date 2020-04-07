import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { IonCardHeader, IonCard, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import Avatar from '../../Reusables/ionic/Avatar';

const Profile = (props) => {
    const user = props.sessionStore.authUser;
    return (
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
                <Avatar
                    user={user}
                    size="200px"
                />
                </div>
                <div>
                <IonCardHeader class="ion-text-center">
                    <IonCardSubtitle >{user.username}</IonCardSubtitle>
                    <IonCardTitle>{user.email}</IonCardTitle>
                </IonCardHeader>
                </div>
            </IonCard>
        </div>
    )
}

export default compose(
    inject('sessionStore'),
    observer,
)(Profile);