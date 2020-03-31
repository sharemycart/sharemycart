import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import SimpleUI from '../simple-ui';
import './page.css';

const Account: React.FC = () => {
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
        <SimpleUI />
      </IonContent>
    </IonPage>
  );
};

export default Account;
