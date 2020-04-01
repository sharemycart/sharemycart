import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Shopping from './Shopping';
import { withEmailVerification, withAuthorization } from '../../Session';
import { compose } from 'recompose';


import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './page.css';

const ShoppingPage: React.FC = () => {
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
        <Shopping />
      </IonContent>
    </IonPage>
  );
};


const condition = (authUser: any) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(ShoppingPage);
