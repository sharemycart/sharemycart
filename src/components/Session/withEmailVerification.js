import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';


import { Trans } from 'react-i18next';
import {
  IonContent, IonGrid, IonRow, IonCol, IonButton,
} from '@ionic/react';
import { withFirebase } from '../Firebase';
import SplashLogo from '../Reusables/ionic/SplashLogo';

import '../Reusables/sign-in-up-page.scss';

const needsEmailVerification = (authUser) => authUser
  && !authUser.emailVerified
  && authUser.providerData
    .map((provider) => provider.providerId)
    .includes('password');

const withEmailVerification = (Component) => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return needsEmailVerification(
        this.props.sessionStore.authUser,
      ) ? (
        <IonContent className="login-page">
          <SplashLogo
            maxWidth="150px"
            textStart="Check"
            textEnd="YourEmail"
          />
          <IonGrid>
            <IonRow>
              <IonCol>
                {this.state.isSent ? (
                  <Trans>Email_confirmation_sent</Trans>
                ) : (
                  <Trans>Email_verification_needed</Trans>
                )}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton
                  type="button"
                  onClick={this.onSendEmailVerification}
                  disabled={this.state.isSent}
                  expand="block"
                >
                  <Trans>Send confirmation E-Mail</Trans>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
        ) : (
          <Component {...this.props} />
        );
    }
  }

  return compose(
    withFirebase,
    inject('sessionStore'),
    observer,
  )(WithEmailVerification);
};

export default withEmailVerification;
