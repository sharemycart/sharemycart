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
        <IonFooter translucent style={
          {
            // this would pin the footer to the bottom.
            // Unfortunately, this seems not work be accepted in Safari
            // position: 'fixed',
            // left: '0',
            // bottom: '10px',
            // right: '0',
          }
        }>
          <IonToolbar>
            <PasswordChangeButton />
            <SignOutButton />
          </IonToolbar>
        </IonFooter>
        {/* The following components allow the user to manage their logins */}
        {/* 
        <PasswordForgetForm />
        <PasswordChangeForm />
        <LoginManagement authUser={sessionStore.authUser} /> 
        */}

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