import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonContent, IonImg, IonGrid, IonRow, IonCol, IonLabel } from '@ionic/react';

import {Trans} from 'react-i18next'

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
    <IonContent>

      <SignUpForm />

    </IonContent>
  </IonPage>
)

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, isAdmin } = this.state;
    const roles = {};

    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }

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
        this.props.history.push(ROUTES.HOME);
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
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <>
        <IonImg className="image-login" src="../../../theme/logo-cart_1000.png" />
        <IonGrid>
          <IonRow className="logo-text">
            <IonCol className="ion-align-self-center">
              <IonLabel style={{ color: '#707070' }}>Share</IonLabel>
              <IonLabel style={{ color: '#FA3D04' }}>MyCart</IonLabel>
            </IonCol>
          </IonRow>
        </IonGrid>
        <form onSubmit={this.onSubmit}>
          <input
            name="username"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="Full Name"
          />
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
          <input
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
          <input
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
          />
          <label>
            Admin:
          <input
              name="isAdmin"
              type="checkbox"
              checked={isAdmin}
              onChange={this.onChangeCheckbox}
            />
          </label>
          <button disabled={isInvalid} type="submit">
            <Trans>Sign Up</Trans>
        </button>

          {error && <p>{error.message}</p>}
        </form>
      </>
    );
  }
}

const SignUpLink = () => (
  <span>
    <Trans>No account yet?</Trans>
    &nbsp;
    <Link to={ROUTES.SIGN_UP}>
    <Trans>Sign Up</Trans>
</Link></span>
);

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm, SignUpLink };