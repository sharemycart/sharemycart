import React from 'react';

import ShoppingModel from '../../../models/Shopping'
import Shopping from './Shopping';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import { withEmailVerification } from '../../Session';
import { inject, observer } from 'mobx-react';

import { IonButton, IonIcon, IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonFooter } from '@ionic/react';
import { createOutline, saveOutline } from 'ionicons/icons';

import { Trans } from 'react-i18next';
import ShoppingActions from './ShoppingActions';
import { SHOPPING_LISTS } from '../../../constants/routes';
import AllListsButton from '../../Reusables/ionic/AllListsButton';

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
    const { currentShoppingList } = this.props.shoppingStore;

    const EditButton = () => (
      !this.state.editMode && <IonButton color="danger" fill="clear"
        onClick={() => this.setState({ editMode: true })}>
        <span className="hide-sm-down"><Trans>Edit</Trans></span>
        <IonIcon slot="end" icon={createOutline} />
      </IonButton>
    )

    const SaveButton = () => (
      this.state.editMode && <IonButton color="danger" fill="clear"
        onClick={() => this.saveEdit()}>
        <span className="hide-sm-down"><Trans >Save</Trans></span>
        <IonIcon slot="end" icon={saveOutline} />
      </IonButton>
    )
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{
              (this.props.shoppingStore.currentShoppingList && this.props.shoppingStore.currentShoppingList.name)
              || 'Shopping'
            }</IonTitle>
            <IonButtons slot="primary">
              <EditButton />
              <SaveButton />
            </IonButtons>
            <IonButtons slot="secondary">
              <AllListsButton
                label="All Shopping Lists"
                href={SHOPPING_LISTS}
              />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{
                (this.props.shoppingStore.currentShoppingList && this.props.shoppingStore.currentShoppingList.name)
                || 'Shopping'
              }</IonTitle>
            </IonToolbar>
          </IonHeader>

          {this.props.sessionStore.dbAuthenticated &&
            <Shopping model={this}
              editMode={this.state.editMode}
              addSaveEditHandler={this.addSaveEditHandler.bind(this)}
            />
          }

        </IonContent>
        <IonFooter>
          {currentShoppingList &&
            <ShoppingActions model={this} /> //TODO: make model injectable
          }
        </IonFooter>
      </IonPage>
    );
  }
};


export default compose(
  withFirebase,
  withEmailVerification,
  inject('shoppingStore', 'userStore', 'sessionStore'),
  observer,
)(ShoppingPage);
