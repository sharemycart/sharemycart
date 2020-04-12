import React from 'react';

import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';

import ShoppingModel from '../../../models/Shopping'

import { IonHeader, IonToolbar, IonButtons, IonContent, IonIcon, IonFooter, IonFab, IonFabButton, IonPage, IonTitle } from '@ionic/react';

import { GO_SHOPPING, SHOPPING, SHOPPING_LISTS } from '../../../constants/routes';
import { withEmailVerification } from '../../Session';
import { withFirebase } from '../../Firebase';
import { checkmarkDoneOutline } from 'ionicons/icons';
import LabelledBackButton from '../../Reusables/ionic/LabelledBackButton';
import FinishShopping from './FinishShopping';
import { Trans } from 'react-i18next';
import { withRouter } from 'react-router';

const DoneButton = ({ currentShoppingList, onArchiveShoppingList, history }) =>
  currentShoppingList
    ? (
      <IonFabButton onClick={() => {
        onArchiveShoppingList(currentShoppingList)
        history.push(SHOPPING)
      }}>
        <IonIcon icon={checkmarkDoneOutline} />
      </IonFabButton>
    )
    : null

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

          {this.props.sessionStore.dbAuthenticated
            && <FinishShopping model={this} />}

        </IonContent>
        <IonFooter>
          <IonFab vertical="bottom" horizontal="end">
            <DoneButton
              currentShoppingList={this.props.shoppingStore.currentShoppingList}
              onArchiveShoppingList={this.onArchiveShoppingList}
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
  withRouter,
  inject('shoppingStore', 'userStore', 'sessionStore'),
  observer,
)(FinishShoppingPage);

