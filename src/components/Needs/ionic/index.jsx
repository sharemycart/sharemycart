import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonItem } from '@ionic/react';
import NeedsModel from '../../../models/Needs';
import Needs from './Needs';
import './page.css';
import { withFirebase } from '../../Firebase';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
// import Avatar from '../../Reusables/ionic/Avatar';

import { withTranslation } from 'react-i18next';
import { withEmailVerification } from '../../Session';
import AllListsButton from '../../List/ionic/AllListsButton';
import { NEEDS_LISTS } from '../../../constants/routes';
import ListTitle from '../../List/ionic/ListTitle';
import ListLifecycleIcon from '../../List/ionic/ListLifecycleIcon';
import Avatar from '../../Reusables/ionic/Avatar';

class NeedsPage extends NeedsModel {
  render() {


    const ListHeader = ({
      needsStore,
      userStore,
    }) => {
      const { currentNeedsList } = needsStore
      if (currentNeedsList
        && userStore.users) {
        const owner = userStore.users[currentNeedsList.shoppingListOwnerId]
        if (owner) return (
          <IonItem lines="none">
            <Avatar
              size="35px"
              user={owner}
            />
            <IonTitle size="large">
              <ListLifecycleIcon list={currentNeedsList} />&nbsp;<ListTitle list={currentNeedsList} />
            </IonTitle>
          </IonItem>
        )
      }
      return null
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <ListHeader
              needsStore={this.props.needsStore}
              userStore={this.props.userStore}
            />
            <IonButtons slot="secondary">
              <AllListsButton
                label="All Needs Lists"
                href={NEEDS_LISTS}
              />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonHeader collapse="condense">
            <IonToolbar>
              <ListHeader
                needsStore={this.props.needsStore}
                userStore={this.props.userStore}
              />
            </IonToolbar>
          </IonHeader>

          {this.props.sessionStore.dbAuthenticated &&
            <Needs model={this} />
          }

        </IonContent>
      </IonPage>
    );
  }
}

export default compose(
  withFirebase,
  withEmailVerification,
  withTranslation(),
  inject('needsStore', 'userStore', 'sessionStore'),
  observer,
)(NeedsPage);