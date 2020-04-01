import React from 'react';
import { Switch, Route } from 'react-router-dom';

import * as ROUTES from '../../../constants/routes';
import ShoppingList from './ShoppingList';
import Shopping from './Shopping';
import { withEmailVerification, withAuthorization } from '../../Session';
import { compose } from 'recompose';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

const ShoppingPage = () => {
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

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(ShoppingPage);
