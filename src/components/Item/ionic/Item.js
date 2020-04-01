import React, { Component } from "react";
import { IonItem, IonLabel, IonButton, IonIcon, IonBadge } from "@ionic/react";
import EditItem from './EditItem';
import { trash, add } from 'ionicons/icons';
import { ITEM_TYPE_IN_SHOPPING, ITEM_TYPE_SHOPPING, ITEM_TYPE_NEED } from "../../../constants/items";

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      inEdit: !props.item.quantity ,
      editingItem: props.item,
    };
    this.mode = { mode: props.mode }
  }

  setEditMode(inEdit) {
    this.setState({ inEdit })
  }

  onChangeEditingItem(editingItem) {
		this.setState({ editingItem });
	}

  onItemClick() {
    if (this.props.mode !== ITEM_TYPE_IN_SHOPPING) {
      // this.props.onEditingConcluded(this.state.editingItem)
      this.setEditMode(true)
    } else {
      this.props.onItemClicked()
    }
  }

  render() {
    const needIcon = !this.props.ownList &&
      <IonButton onClick={()=>this.props.onCreateNeed(this.props.item)} fill="add" size="large" slot="end" color="primary">
        <IonIcon icon={add} />
      </IonButton>

    const showQuantityLabel = [ITEM_TYPE_SHOPPING, ITEM_TYPE_NEED, ITEM_TYPE_IN_SHOPPING].includes(this.props.mode)
    const quantityLabel = showQuantityLabel && <IonBadge>
      <IonLabel onClick={() => this.setEditMode(true)}>
        {this.props.item.quantity} {this.props.item.unit}
      </IonLabel>
    </IonBadge>

    const showDeleteButton = this.props.ownList && this.props.mode !== ITEM_TYPE_IN_SHOPPING
    const deleteIcon = showDeleteButton && <IonButton className="button-end" fill="clear" size="large" slot="end" color="danger" onClick={()=>this.props.onDeleteItem(this.props.item.uid)}>
      <IonIcon icon={trash} />
    </IonButton>

    const itemDisplay = this.state.inEdit ?
      <EditItem item={this.state.editingItem}
        onChange={this.onChangeEditingItem.bind(this)}
        onEditingConcluded={() => {
          this.setEditMode(false)
          this.props.onEditingConcluded(this.state.editingItem)
          }
        }
        mode={this.props.mode}
      />
      :
      <>
        <IonLabel onClick={() => this.onItemClick()}
                  style={{
                    cursor: 'pointer',
                    textDecoration: (this.props.item.checked ? 'line-through' : 'none'),
                    color: (this.props.item.checked ? 'grey' : 'black')
                  }}>
          {this.props.item.name}
        </IonLabel>
        {quantityLabel}
        {needIcon}
        {deleteIcon}
      </>

    return <IonItem>
      {itemDisplay}
    </IonItem>
  }
}

export default Item
