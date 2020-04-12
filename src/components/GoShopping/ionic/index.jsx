import React from 'react';

import ShoppingModel from '../../../models/Shopping'
import GoShopping from './GoShopping';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import { withEmailVerification } from '../../Session';
import { inject, observer } from 'mobx-react';

import { IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonFooter, IonFab } from '@ionic/react';

import { SHOPPING } from '../../../constants/routes';
import LabelledBackButton from '../../Reusables/ionic/LabelledBackButton';
import FinishShoppingAction from './FinishShoppingAction';

class ShoppingPage extends ShoppingModel {

  render() {
    const { currentShoppingList } = this.props.shoppingStore;

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{
              (this.props.shoppingStore.currentShoppingList && this.props.shoppingStore.currentShoppingList.name)
              || 'Shopping'
            }</IonTitle>
            <IonButtons slot="primary">
            </IonButtons>
            <IonButtons slot="secondary">
                <LabelledBackButton defaultHref={SHOPPING} />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{
              (this.props.shoppingStore.currentShoppingList && this.props.shoppingStore.currentShoppingList.name)
              || 'Shopping'
            }</IonTitle>
            </IonToolbar>
          </IonHeader>

          {this.props.sessionStore.dbAuthenticated &&
            <GoShopping model={this} />
          }

        </IonContent>
        <IonFooter>
          {currentShoppingList &&
            <IonFab vertical="bottom" horizontal="end">
                <FinishShoppingAction />
              </IonFab>
            }
        </IonFooter>
      </IonPage>
    );
  }
};


// const condition = (authUser) => !!authUser;

export default compose(
  withFirebase,
  withEmailVerification,
  inject('shoppingStore', 'userStore', 'sessionStore'),
  observer,
)(ShoppingPage);
