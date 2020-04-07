import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFooter } from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { withEmailVerification, withAuthorization } from '../../Session';
import { compose } from 'recompose';
import Profile from './Profile';
import SignOutButton from '../../SignOut/ionic'

import { PasswordChangeButton } from '../../PasswordChange/ionic'

import './page.css';

const AccountPage = ({ sessionStore }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Profile />
        <IonFooter>
          <IonToolbar>
            <PasswordChangeButton />
            <SignOutButton />
          </IonToolbar>
        </IonFooter>
      </IonContent>
    </IonPage>
  );
};

const condition = authUser => !!authUser;

export default compose(
  inject('sessionStore'),
  observer,
  withEmailVerification,
  withAuthorization(condition),
)(AccountPage);