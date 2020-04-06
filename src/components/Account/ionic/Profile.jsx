import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { IonAvatar, IonCardHeader, IonCard, IonCardSubtitle, IonCardTitle } from '@ionic/react';

const Profile = (props) => {
    let user = props.sessionStore.authUser;
    const size = 200;
    let userImage = user ? user.photoURL : null;
    const emailMd5 = '';
    const namePathComponent = encodeURIComponent(encodeURIComponent(user.username));
    // const colorPathComponent = encodeURIComponent(`color=${ff0000}`);
    let src = userImage
        ? userImage
        : (`https://www.gravatar.com/avatar/${emailMd5}&s=${size}?d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/${namePathComponent}/${size}%3Frounded%3Dtrue%26bold%3Dtrue`);

    return (
        <div style={{
            height: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <IonCard style={{
            padding: '50px',
        }}>
                <IonAvatar style={{ width: size, height: size }}>
                    <img src={src} alt="User Profile" />
                </IonAvatar>
                <IonCardHeader class="ion-text-center">
                    <IonCardSubtitle >{user.username}</IonCardSubtitle>
                    <IonCardTitle>{user.email}</IonCardTitle>
                </IonCardHeader>
            </IonCard>
        </div>
    )
}

export default compose(
    inject('sessionStore'),
    observer,
)(Profile);