import React from 'react';

import ShoppingModel from '../../../models/Shopping'
import Shopping from './Shopping';
import { compose } from 'recompose';

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './page.css';
import { withFirebase } from '../../Firebase';
import { inject, observer } from 'mobx-react';

class ShoppingPage extends ShoppingModel {

  render() {
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

          {this.props.sessionStore.dbAuthenticated &&
            <Shopping model={this} />
          }

        </IonContent>
      </IonPage>
    );
  }
};


const condition = (authUser: any) => !!authUser;

export default compose(
  withFirebase,
  inject('shoppingStore', 'sessionStore'),
  observer,
)(ShoppingPage);
