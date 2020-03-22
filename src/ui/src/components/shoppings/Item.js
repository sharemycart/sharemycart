import React, { Component } from "react";
import { IonItem, IonLabel, IonButton, IonIcon, IonBadge } from "@ionic/react";
import EditItem from './EditItem';
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import { trash, add } from 'ionicons/icons';

class Item extends Component {
	constructor (props) {
		super(props);
		this.state = { inEdit: false };
  }
  
  setEditMode(inEdit) {
    this.setState({inEdit})
  }

  render() {
    const needIcon = !this.props.ownList &&
      <IonButton fill="add" size="large" slot="end" color="primary">
        <IonIcon icon={add} />
      </IonButton>

    const itemDisplay = this.state.inEdit ?
      <EditItem item={this.props.item}
        onChange={this.props.onUpdateItem}
        onClose={() => this.setEditMode(false)}
      />
      :
      <>
        <IonLabel onClick={() => this.setEditMode(true)}>{this.props.item.name}</IonLabel>
        <IonBadge>
          {this.props.item.quantity} {this.props.item.unit}
        </IonBadge>
        {needIcon}
        <IonButton className="button-end" fill="clear" size="large" slot="end" color="danger" onClick={this.props.onDeleteItem}>
          <IonIcon icon={trash} />
        </IonButton>
      </>

    return <IonItem>
      {itemDisplay}
    </IonItem>
  }
}

export default withRouter(inject('store')(observer(Item)))
