import React from 'react';

import ShoppingModel from '../../../models/Shopping'
import Shopping from './Shopping';
import { compose } from 'recompose';

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonIcon, IonButton } from '@ionic/react';
import './page.css';
import { withFirebase } from '../../Firebase';
import { inject, observer } from 'mobx-react';
import { createOutline, saveOutline, cartOutline, documentTextOutline } from 'ionicons/icons';

import { Trans } from 'react-i18next';
import { withEmailVerification } from '../../Session';
import { GO_SHOPPING, SHOPPING } from '../../../constants/routes';
class ShoppingPage extends ShoppingModel {

  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, {
      editMode: false
    })

    this.saveHandler = []
  }

  saveEdit() {
    this.saveHandler.forEach(handler => handler())
    this.setState({ editMode: false })
  }

  addSaveEditHandler(handlerFn) {
    this.saveHandler.push(handlerFn)
  }

  render() {
    const EditButton = () => (
      !this.state.editMode && <IonButton color="danger" fill="clear"
        onClick={() => this.setState({ editMode: true })}>
        <Trans>Edit</Trans>
        <IonIcon slot="end" icon={createOutline} />
      </IonButton>
    )

    const SaveButton = () => (
      this.state.editMode && <IonButton color="danger" fill="clear"
        onClick={() => this.saveEdit()}>
        <Trans>Save</Trans>
        <IonIcon slot="end" icon={saveOutline} />
      </IonButton>
    )

    const ModeButton = () => {
      if (this.props.location.pathname === SHOPPING) {
        return (
          <IonButton fill="clear" href={GO_SHOPPING}>
            <Trans>Go Shopping</Trans>
            <IonIcon slot="start" icon={cartOutline} />
          </IonButton>
        )
      }
      if (this.props.location.pathname === GO_SHOPPING) {
        return (
          <IonButton fill="clear" href={SHOPPING}>
            <Trans>Plan Shopping</Trans>
            <IonIcon slot="start" icon={documentTextOutline} />
          </IonButton>
        )
      }
      return null
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="secondary">
              <ModeButton />
            </IonButtons>
            <IonTitle>{
              (this.props.shoppingStore.currentShoppingList && this.props.shoppingStore.currentShoppingList.name)
              || 'Shopping'
            }</IonTitle>
            <IonButtons slot="primary">
              <EditButton />
              <SaveButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Shopping</IonTitle>
            </IonToolbar>
          </IonHeader>

          {this.props.sessionStore.dbAuthenticated &&
            <Shopping model={this}
              editMode={this.state.editMode}
              addSaveEditHandler={this.addSaveEditHandler.bind(this)}
            />
          }

        </IonContent>
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
