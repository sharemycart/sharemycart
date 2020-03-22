import React, { Component } from "react";
import { IonItem, IonLabel, IonButton, IonIcon, IonBadge } from "@ionic/react";
import EditItem from './EditItem';
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import { trash, add } from 'ionicons/icons';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = { inEdit: false };
    this.mode = { mode: props.mode }
  }

  setEditMode(inEdit) {
    this.setState({ inEdit })
  }

  render() {
    const needIcon = !this.props.ownList &&
      <IonButton fill="add" size="large" slot="end" color="primary">
        <IonIcon icon={add} />
      </IonButton>

    const quantityLabel = this.props.mode === "shopping" && <IonBadge>
      <IonLabel onClick={() => this.setEditMode(true)}>
        {this.props.item.quantity} {this.props.item.unit}
      </IonLabel>
    </IonBadge>

    const deleteIcon = this.props.ownList === true && <IonButton className="button-end" fill="clear" size="large" slot="end" color="danger" onClick={this.props.onDeleteItem}>
      <IonIcon icon={trash} />
    </IonButton>

    const itemDisplay = this.state.inEdit ?
      <EditItem item={this.props.item}
        onChange={this.props.onUpdateItem}
        onClose={() => this.setEditMode(false)}
      />
      :
      <>
        <IonLabel onClick={() => this.setEditMode(true)}>{this.props.item.name}</IonLabel>
        {quantityLabel}
        {needIcon}
        {deleteIcon}
      </>

    return <IonItem>
      {itemDisplay}
    </IonItem>
  }
}

export default withRouter(inject('store')(observer(Item)))
