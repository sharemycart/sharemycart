import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import SimpleUI from '../simple-ui';
import './page.css';

const Shopping: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Shopping</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Shopping</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SimpleUI />
      </IonContent>
    </IonPage>
  );
};

export default Shopping;
