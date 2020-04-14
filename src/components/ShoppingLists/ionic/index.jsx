import React from 'react';

import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';

import ShoppingModel from '../../../models/Shopping'

import { IonHeader, IonToolbar, IonButtons, IonContent, IonIcon, IonFooter, IonFab, IonFabButton, IonPage, IonToggle, IonLabel, IonItem } from '@ionic/react';

import { SHOPPING } from '../../../constants/routes';
import Lists from '../../List/ionic/Lists';
import { withEmailVerification } from '../../Session';
import { withFirebase } from '../../Firebase';
import { addOutline } from 'ionicons/icons';
import LabelledBackButton from '../../Reusables/ionic/LabelledBackButton';

const CreateShoppingListButton = ({ onCreateShoppingList, history }) => (
  <IonFabButton onClick={() => {
    onCreateShoppingList()
    history.push(SHOPPING)
  }}>
    <IonIcon icon={addOutline} />
  </IonFabButton>
)

class ShoppingListsPage extends ShoppingModel {

  constructor(props) {
    super(props)

    this.state = { ...this.state, includeArchived: false }
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <LabelledBackButton defaultHref={SHOPPING} />
            </IonButtons>
            <IonItem lines="none" slot="end">
              <IonLabel>Include archived</IonLabel>
              <IonToggle checked={this.state.includeArchived} onIonChange={e => this.setState({ includeArchived: e.detail.checked })} />
            </IonItem>
          </IonToolbar>
        </IonHeader>
        <IonContent>

          {this.props.sessionStore.dbAuthenticated
            && <Lists
              lists={this.props.shoppingStore.shoppingListsArray}
              onSetCurrentList={(listId) => this.onSetCurrentShoppingList(listId)}
              onRemoveList={(listId) => this.onRemoveShoppingList(listId)}
              includeArchived={this.state.includeArchived}
              hrefOnClick={SHOPPING}
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

