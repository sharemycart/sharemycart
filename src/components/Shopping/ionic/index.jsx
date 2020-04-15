import React from 'react';

import ShoppingModel from '../../../models/Shopping'
import Shopping from './Shopping';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import { withEmailVerification } from '../../Session';
import { inject, observer } from 'mobx-react';

import { IonButton, IonIcon, IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonFooter, IonInput } from '@ionic/react';
import { createOutline, saveOutline } from 'ionicons/icons';

import { Trans } from 'react-i18next';
import ShoppingActions from './ShoppingActions';
import { SHOPPING_LISTS } from '../../../constants/routes';
import AllListsButton from '../../List/ionic/AllListsButton';
import ListTitle from '../../List/ionic/ListTitle';
import ListLifecycleIcon from '../../List/ionic/ListLifecycleIcon';

class ShoppingPage extends ShoppingModel {

  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, {
      editMode: false,
      editingName: '',
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

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { currentShoppingList, currentShoppingListItemsArray: currentShoppingListItems, initializationDone } = this.props.shoppingStore;

    const EditButton = () => (
      !this.state.editMode && <IonButton color="danger" fill="clear"
        onClick={() => this.setState({ editMode: true })}>
        <span className="hide-sm-down"><Trans>Edit</Trans></span>
        <IonIcon slot="end" icon={createOutline} />
      </IonButton>
    )

    this.addSaveEditHandler(() => {
      if (this.state.editingName) {
        this.updateShoppingListName(currentShoppingList.uid, this.state.editingName)
      }
    })

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
            <IonTitle>
              <ListLifecycleIcon list={currentShoppingList} slot={""} />&nbsp;<ListTitle list={currentShoppingList} />
            </IonTitle>
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
              {this.state.editMode
                ? <IonInput
                  size="large"
                  name="editingName"
                  value={this.state.editingName || currentShoppingList.name}
                  onIonChange={this.onChange}
                  onIonBlur={() => this.onEditShoppingList(currentShoppingList, this.state.editingName)}
                  debounce="100"
                />
                : <IonTitle size="large">
                  <ListLifecycleIcon list={currentShoppingList} slot={""} />&nbsp;<ListTitle list={currentShoppingList} />
                </IonTitle>
              }
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
          {initializationDone &&
            <ShoppingActions
              model={this}
              hasItems={currentShoppingListItems && currentShoppingListItems.length} /> //TODO: make model injectable
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
