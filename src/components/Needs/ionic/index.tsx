import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Needs from './Needs';
import './page.css';

const NeedsPage: React.FC = () => {
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
        <Needs />
      </IonContent>
    </IonPage>
  );
};

export default NeedsPage;
