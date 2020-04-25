import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonContent, IonRow, IonCol, IonInput } from '@ionic/react';

import { withTranslation, Trans } from 'react-i18next'
import { compose } from 'recompose';

import '../../Reusables/sign-in-up-page.scss'
import SplashLogo from '../../Reusables/ionic/SplashLogo';

const SignUpPage = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="secondary">
          <IonButton fill="clear">
            <Trans>Help</Trans>
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent className="login-page">
      <SplashLogo maxWidth="150px" />

      <SignUpForm />

    </IonContent>
  </IonPage>
)

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  isAdmin: false,
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
    const roles = {};

    const { t } = this.props;

    const ERROR_MSG_ACCOUNT_EXISTS = t('Account_already_exists');

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set(
          {
            username,
            email,
            roles,
          },
          { merge: true },
        );
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        const {location} = this.props
        const isShareRedirect = !!(location.state && location.state.from && location.state.from.pathname.match('^/share/'))
        if(isShareRedirect){
          this.props.history.push(location.state.from.pathname);
        } else {
        this.props.history.push(ROUTES.SHOPPING);
        }
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {

    const { t } = this.props;

    const {
      username,
      email,
      passwordOne,
      error,
    } = this.state;

    const isInvalid =
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <>
        <form onSubmit={this.onSubmit}>
          <IonRow>
            <IonCol>
              <IonInput
                name="username"
                value={username}
                type="text"
                placeholder={t("Full Name")}
                onIonChange={this.onChange}
                clearInput
                className="input"
                padding-horizontal
                clear-input="true"
                autocomplete="name"
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput
                name="email"
                value={email}
                onIonChange={this.onChange}
                clearInput
                type="email"
                placeholder={t('Email')}
                className="input"
                padding-horizontal
                clear-input="true"
                autocomplete="username email"
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput
                clearInput
                name="passwordOne"
                value={passwordOne}
                onIonChange={this.onChange}
                type="password"
                placeholder={t('Password')}
                className="input"
                padding-horizontal
                autocomplete="new-password">
              </IonInput>
            </IonCol>
          </IonRow>
          <IonButton disabled={isInvalid} type="submit" expand="block">
            <Trans>Sign Up</Trans>
          </IonButton>
          {error && <p>{error.message}</p>}
        </form>
      </>
    );
  }
}

const SignUpLink = ({state}) => (
  <span>
    <Trans>No account yet?</Trans>
    &nbsp;
    <Link to={{pathname: ROUTES.SIGN_UP, state}} >
      <Trans>Sign Up</Trans>
    </Link></span>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
  withTranslation()
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };