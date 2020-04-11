import React from 'react';

import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';

import NeedsModel from '../../../models/Needs'

import { IonHeader, IonToolbar, IonButtons, IonContent, IonBackButton, IonFooter, IonPage } from '@ionic/react';

import { NEEDS, NEEDS_LISTS } from '../../../constants/routes';
import Lists from '../../Reusables/ionic/Lists';
import { withEmailVerification } from '../../Session';
import { withFirebase } from '../../Firebase';

class NeedsListsPage extends NeedsModel {
  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={NEEDS} />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>

          {this.props.sessionStore.dbAuthenticated
            && <Lists
              lists={this.props.needsStore.needsListsArray}
              onSetCurrentList={(listId) => this.onSetCurrentNeedsList(listId)}
              onRemoveList={(listId) => this.onRemoveNeedsList(listId)}
              hrefOnClick={NEEDS}
            />}

        </IonContent>
        <IonFooter>

        </IonFooter>
      </IonPage>)
  }
}

export default compose(
  withFirebase,
  withEmailVerification,
  inject('needsStore', 'userStore', 'sessionStore'),
  observer,
)(NeedsListsPage);

