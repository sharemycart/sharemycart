import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import NeedsModel from '../../../models/Needs';
import Needs from './Needs';
import './page.css';
import { withFirebase } from '../../Firebase';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
// import Avatar from '../../Reusables/ionic/Avatar';

import {Trans} from 'react-i18next';
import { withEmailVerification } from '../../Session';
import Avatar from '../../Reusables/ionic/Avatar';

class NeedsPage extends NeedsModel {
  render() {
    const ListHeader = ({
      needsStore,
      userStore,
    }) => {
      if (needsStore.currentNeedsList
        && userStore.users) {
        const owner = userStore.users[needsStore.currentNeedsList.shoppingListOwnerId]
        if (owner) return (
          <IonTitle size="large">
            
              {/* // TODO: Display the Avatar of the owner */}
              {/* <Avatar
              size="35px"
              user={owner}
            /> */}
            <span>
              <Trans>by</Trans> {owner.username}
            </span>
          </IonTitle>
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
  inject('needsStore', 'userStore', 'sessionStore'),
  observer,
)(NeedsPage);