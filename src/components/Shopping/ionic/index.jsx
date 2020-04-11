import React from 'react';

import ShoppingModel from '../../../models/Shopping'
import Shopping from './Shopping';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import { withEmailVerification } from '../../Session';
import { inject, observer } from 'mobx-react';

import { IonButton, IonIcon, IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonFooter, IonFab } from '@ionic/react';
import { createOutline, saveOutline } from 'ionicons/icons';

import { Trans } from 'react-i18next';
import ShoppingActions from './ShoppingActions';
import { SHOPPING_LISTS, SHOPPING, GO_SHOPPING } from '../../../constants/routes';
import AllListsButton from '../../Reusables/ionic/AllListsButton';
import LabelledBackButton from '../../Reusables/ionic/LabelledBackButton';
import FinishShoppingAction from './FinishShoppingAction';

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
              {this.props.location.pathname === GO_SHOPPING &&
                <LabelledBackButton defaultHref={SHOPPING} />}
              {this.props.location.pathname !== GO_SHOPPING &&
                <AllListsButton
                  label="All Shopping Lists"
                  href={SHOPPING_LISTS}
                />}
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
            this.props.location.pathname == SHOPPING
            ? <ShoppingActions />
            :   <IonFab vertical="bottom" horizontal="end">
                <FinishShoppingAction />
              </IonFab>
            }
        </IonFooter>
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
