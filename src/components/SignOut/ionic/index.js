import React from 'react';

import { withFirebase } from '../../Firebase';
import { IonButton, IonIcon } from '@ionic/react';
import { logOut } from 'ionicons/icons';

const SignOutButton = ({ firebase }) => (
  <IonButton
    expand="full"
    onClick={firebase.doSignOut}
  >
    LOGOUT
    <IonIcon slot="end" icon={logOut} />
  </IonButton>
);

export default withFirebase(SignOutButton);
