import React from 'react';

import ShoppingModel from '../../../models/Shopping'
import Shopping from './Shopping';
import { compose } from 'recompose';

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonIcon, IonButton } from '@ionic/react';
import './page.css';
import { withFirebase } from '../../Firebase';
import { inject, observer } from 'mobx-react';
import { createOutline, saveOutline, cartOutline } from 'ionicons/icons';

class ShoppingPage extends ShoppingModel {

  constructor(props){
    super(props);
    this.state = Object.assign(this.state, {
      editMode: false
    })

    this.saveHandler = []
  }

  saveEdit(){
    this.saveHandler.forEach(handler=>handler())
    this.setState({editMode: false})
  }

  addSaveEditHandler(handlerFn){
    this.saveHandler.push(handlerFn)
  }

  render() {
    const EditButton = () => (
      !this.state.editMode && <IonButton color="danger" fill="clear"
        onClick={() => this.setState({ editMode: true })}>
        {'Edit'}
        <IonIcon slot="end" icon={createOutline} />
      </IonButton>
    )

    const SaveButton = () => (
      this.state.editMode && <IonButton color="danger" fill="clear"
        onClick={() => this.saveEdit()}>
        {'Save'}
        <IonIcon slot="end" icon={saveOutline} />
      </IonButton>
    )
    
    return (
      <IonPage>
        <IonHeader>
        <IonToolbar>
          <IonButtons slot="secondary">
            <IonButton fill="clear">
              Go Shopping
              <IonIcon slot="start" icon={cartOutline} />
            </IonButton>
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
  inject('shoppingStore', 'sessionStore'),
  observer,
)(ShoppingPage);
