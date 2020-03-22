import React, { Component } from "react";
import { IonItem, IonLabel, IonButton, IonIcon, IonBadge } from "@ionic/react";
import EditItem from './EditItem';
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import { trash, add, checkmark } from 'ionicons/icons';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = { inEdit: !props.item.quantity };
    this.mode = { mode: props.mode }
  }

  setEditMode(inEdit) {
    this.setState({ inEdit })
  }

  onItemClick() {
    if (this.props.mode !== 'goshopping') {
      this.setEditMode(true)
    } else {
      this.props.onItemClicked()
    }
  }

  render() {
    const needIcon = !this.props.ownList &&
      <IonButton onClick={this.props.onCreateNeed} fill="add" size="large" slot="end" color="primary">
        <IonIcon icon={add} />
      </IonButton>

    const quantityLabel = (this.props.mode === "shopping" || this.props.mode === "need") && <IonBadge>
      <IonLabel onClick={() => this.setEditMode(true)}>
        {this.props.item.quantity} {this.props.item.unit}
      </IonLabel>
    </IonBadge>

    const showDeleteButton = this.props.ownList && this.props.mode !== 'goshopping'
    const deleteIcon = showDeleteButton && <IonButton className="button-end" fill="clear" size="large" slot="end" color="danger" onClick={this.props.onDeleteItem}>
      <IonIcon icon={trash} />
    </IonButton>

    const checkIcon = this.props.item.checked && <IonIcon icon={checkmark}/>

    const itemDisplay = this.state.inEdit ?
      <EditItem item={this.props.item}
        onChange={this.props.onUpdateItem}
        onClose={() => this.setEditMode(false)}
        mode={this.props.mode}
      />
      :
      <>
        <IonLabel onClick={() => this.onItemClick()}
                  style={{cursor: 'pointer', 'text-decoration': (this.props.item.checked ? 'line-through' : 'none')}}>
          {this.props.item.name}
        </IonLabel>
        {checkIcon}
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
