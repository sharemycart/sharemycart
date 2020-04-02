import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import NeedsModel from '../../../models/Needs';
import Needs from './Needs';
import './page.css';
import { withFirebase } from '../../Firebase';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';

class NeedsPage extends NeedsModel {
  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Needs</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Needs</IonTitle>
            </IonToolbar>
          </IonHeader>

          <Needs
            model={this}
          />

        </IonContent>
      </IonPage>
    );
  }
}

export default compose(
  withFirebase,
  inject('needsStore', 'sessionStore'),
  observer,
)(NeedsPage);