import React from 'react';

import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';

import ShoppingModel from '../../../models/Shopping'

import { IonHeader, IonToolbar, IonButtons, IonContent, IonBackButton, IonIcon, IonFooter, IonFab, IonFabButton, IonPage } from '@ionic/react';

import { SHOPPING } from '../../../constants/routes';
import Lists from '../../Reusables/ionic/Lists';
import { withEmailVerification } from '../../Session';
import { withFirebase } from '../../Firebase';
import { addOutline } from 'ionicons/icons';

const CreateShoppingListButton = ({ onCreateShoppingList, history }) => (
  <IonFabButton onClick={() => {
    onCreateShoppingList(new Date().toLocaleDateString())
    history.push(SHOPPING)
  }}>
    <IonIcon icon={addOutline} />
  </IonFabButton>
)

class ShoppingListsPage extends ShoppingModel {
  render() {
    return (
      <IonPage>
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
              onSetCurrentList={(listId) => this.onSetCurrentShoppingList(listId)}
              onRemoveList={(listId) => this.onRemoveShoppingList(listId)}
            />}

        </IonContent>
        <IonFooter>
          <IonFab vertical="bottom" horizontal="end">
            <CreateShoppingListButton
              onCreateShoppingList={this.onCreateShoppingList}
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
)(ShoppingListsPage);

