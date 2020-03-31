import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import SimpleUI from '../simple-ui';
import './page.css';

const Needs: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Needs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Needs</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SimpleUI />
      </IonContent>
    </IonPage>
  );
};

export default Needs;
