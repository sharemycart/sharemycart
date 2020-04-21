import React, { Component } from 'react';

import { withFirebase } from '../../Firebase';
import { IonHeader, IonButtons, IonToolbar, IonContent, IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon } from '@ionic/react';
import { ACCOUNT, PASSWORD_CHANGE } from '../../../constants/routes';
import SplashLogo from '../../Reusables/ionic/SplashLogo';
import { pencilOutline } from 'ionicons/icons';

import {Trans} from 'react-i18next';
import LabelledBackButton from '../../Reusables/ionic/LabelledBackButton';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

const PasswordChangePage = () => (
  <>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <LabelledBackButton defaultHref={ACCOUNT} />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent className="login-page">
      <SplashLogo
        maxWidth="100px"
        textStart="Change"
        textEnd="MyPassword!"
      />
      <IonGrid>
        <PasswordChangeForm />
      </IonGrid>
    </IonContent>
  </>
);

class PasswordChangeFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <form onSubmit={this.onSubmit}>
        <IonRow>
          <IonCol>
            <IonInput
              name="passwordOne"
              value={passwordOne}
              onIonChange={this.onChange}
              clearInput
              type="password"
              placeholder="Type your password"
              class="input"
              padding-horizontal
              clear-input="true">
            </IonInput>
            <IonInput
              name="passwordTwo"
              value={passwordTwo}
              onIonChange={this.onChange}
              clearInput
              type="password"
              placeholder="Confirm new password"
              class="input"
              padding-horizontal
              clear-input="true">
            </IonInput>
          </IonCol>
        </IonRow>
        <IonButton type="submit" disabled={isInvalid} expand="block">
          Reset My Password
        </IonButton>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const PasswordChangeButton = () => (
  <IonButton expand="block" color="secondary" href={PASSWORD_CHANGE}>
    <Trans>Change Password</Trans>
    <IonIcon slot="end" icon={pencilOutline} />
  </IonButton>
);

const PasswordChangeForm = withFirebase(PasswordChangeFormBase);

export default PasswordChangePage
export { PasswordChangeButton }