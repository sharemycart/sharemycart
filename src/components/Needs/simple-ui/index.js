import React from 'react';
import { Switch, Route } from 'react-router-dom';

import * as ROUTES from '../../../constants/routes';
import NeedsList from './NeedsList';
import Needs from './Needs';
import NeedsInSharedShoppingList from './SharedShoppingList';
import { withEmailVerification, withAuthorization } from '../../Session';
import { compose } from 'recompose';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

const NeedsPage = () => {
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
            <IonTitle size="large">Shopping</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Needs />
      </IonContent>
    </IonPage>
  );
};
const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(NeedsPage);
