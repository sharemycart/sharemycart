import React from 'react';

import { IonButton, IonIcon } from '@ionic/react';
import { logOut } from 'ionicons/icons';

import { Trans } from 'react-i18next';
import { withFirebase } from '../../Firebase';

const SignOutButton = ({ firebase }) => (
  <IonButton
    expand="full"
    onClick={firebase.doSignOut}
  >
    <Trans>Sign Out</Trans>
    <IonIcon slot="end" icon={logOut} />
  </IonButton>
);

export default withFirebase(SignOutButton);
