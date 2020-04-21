import React from 'react';

import { withFirebase } from '../../Firebase';
import { IonButton, IonIcon } from '@ionic/react';
import { logOut } from 'ionicons/icons';

import { Trans } from 'react-i18next';

const SignOutButton = ({ firebase }) => (
  <IonButton
    expand="block"
    onClick={firebase.doSignOut}
  >
    <Trans>Sign Out</Trans>
    <IonIcon slot="end" icon={logOut} />
  </IonButton>
);

export default withFirebase(SignOutButton);
