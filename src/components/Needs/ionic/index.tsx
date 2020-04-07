import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import NeedsModel from '../../../models/Needs';
import Needs from './Needs';
import './page.css';
import { withFirebase } from '../../Firebase';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import Avatar from '../../Reusables/ionic/Avatar';

class NeedsPage extends NeedsModel {
  render() {
    const ListHeader = () => {
      if (this.props.needsStore.currentNeedsList
        && this.props.userStore.users) {
        const owner = this.props.userStore.users[this.props.needsStore.currentNeedsList.shoppingListOwnerId]
         if(owner) return (
          <Avatar
            size={30}
            user={this.props.userStore.users[this.props.needsStore.currentNeedsList.shoppingListOwnerId]}
          />
        )
      }
      return (
        <IonTitle size="large">
          Needs
        </IonTitle>
      )
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <ListHeader />
            </IonToolbar>
        </IonHeader>
        <IonContent>
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
  inject('needsStore', 'userStore', 'sessionStore'),
  observer,
)(NeedsPage);