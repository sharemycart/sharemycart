import React from 'react';

import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';

import ShoppingModel from '../../../models/Shopping'

import { IonHeader, IonToolbar, IonButtons, IonContent, IonIcon, IonFooter, IonFab, IonFabButton, IonPage, IonTitle } from '@ionic/react';

import { GO_SHOPPING } from '../../../constants/routes';
import { withEmailVerification } from '../../Session';
import { withFirebase } from '../../Firebase';
import {  checkmarkDoneOutline } from 'ionicons/icons';
import LabelledBackButton from '../../Reusables/ionic/LabelledBackButton';
import FinishShopping from './FinishShopping';
import { Trans } from 'react-i18next';

const DoneButton = ( ) => (
  <IonFabButton onClick={() => {}}>
    <IonIcon icon={checkmarkDoneOutline} />
  </IonFabButton>
)

class FinishShoppingPage extends ShoppingModel {
  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <LabelledBackButton defaultHref={GO_SHOPPING} />
            </IonButtons>
            <IonTitle>
              <Trans>Finish shopping</Trans>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>

        {this.props.sessionStore.dbAuthenticated && <FinishShopping />}

        </IonContent>
        <IonFooter>
          <IonFab vertical="bottom" horizontal="end">
            <DoneButton
              history={this.props.history}
            />
          </IonFab>
        </IonFooter>
      </IonPage>)
  }
}

export default compose(
  withFirebase,
  withEmailVerification,
  inject('shoppingStore', 'userStore', 'sessionStore'),
  observer,
)(FinishShoppingPage);

