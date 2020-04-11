import React from 'react';

import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';

import ShoppingModel from '../../../models/Shopping'

import { IonHeader, IonToolbar, IonButtons, IonContent, IonBackButton } from '@ionic/react';

import { SHOPPING } from '../../../constants/routes';
import Lists from '../../Reusables/ionic/Lists';
import { withEmailVerification } from '../../Session';
import { withFirebase } from '../../Firebase';

class ShoppingListsPage extends ShoppingModel {
  render() {
    return (
      <>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={SHOPPING} />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>

          {this.props.sessionStore.dbAuthenticated
            && <Lists
              lists={this.props.shoppingStore.shoppingListsArray}
              onSetCurrentList={(listId)=>this.onSetCurrentShoppingList(listId)}
              onRemoveList={(listId)=>this.onRemoveShoppingList(listId)}
            />}

        </IonContent>
      </>
    )
  }
}

export default compose(
  withFirebase,
  withEmailVerification,
  inject('shoppingStore', 'userStore', 'sessionStore'),
  observer,
)(ShoppingListsPage);

