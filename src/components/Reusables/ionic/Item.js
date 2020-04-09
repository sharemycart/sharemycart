import React, { Component } from "react";
import { IonItem, IonLabel, IonButton, IonIcon, IonBadge, IonReorder, IonCheckbox, IonList } from "@ionic/react";
import EditItem from './EditItem';
import { trash, add } from 'ionicons/icons';
import { ITEM_TYPE_IN_SHOPPING, ITEM_TYPE_SHOPPING, ITEM_TYPE_NEW_SHOPPING, ITEM_TYPE_NEED, ITEM_TYPE_POTENTIAL_NEED, ITEM_TYPE_BRING_ALONG } from "../../../constants/items";
import { compose } from "recompose";
import { inject, observer } from "mobx-react";
import Avatar from "./Avatar";

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inEdit: !props.item.quantity,
    };
  }

  setEditMode(inEdit) {
    this.setState({ inEdit })
  }

  onItemClick() {
    switch (this.props.mode) {
      case ITEM_TYPE_IN_SHOPPING:
        this.props.onShopItem(this.props.item.uid, !this.props.item.shopped)
        break;
      case ITEM_TYPE_POTENTIAL_NEED:
        break;
      default:
        this.setEditMode(true)
        break;
    }
  }

  render() {
    const { item } = this.props;
    const { bringAlongItems } = this.props;

    const needIcon = !this.props.ownList && this.props.mode === ITEM_TYPE_NEED &&
      <IonButton onClick={() => this.props.onCreateNeed(item)} fill="add" size="large" slot="end" color="primary">
        <IonIcon icon={add} />
      </IonButton>

    const showQuantityLabel = [ITEM_TYPE_SHOPPING, ITEM_TYPE_NEW_SHOPPING, ITEM_TYPE_NEED, ITEM_TYPE_IN_SHOPPING, ITEM_TYPE_BRING_ALONG].includes(this.props.mode)
    const quantityLabel = showQuantityLabel && <IonBadge>
      <IonLabel onClick={() => this.setEditMode(true)}>
        {this.props.mode === ITEM_TYPE_BRING_ALONG && "+"}{item.quantity} {item.unit}
      </IonLabel>
    </IonBadge>

    const showDeleteButton = this.props.ownList && this.props.mode !== ITEM_TYPE_IN_SHOPPING
    const deleteIcon = showDeleteButton && <IonButton className="button-end" fill="clear" size="large" slot="end" color="danger" onClick={() => this.props.onDeleteItem(item.uid)}>
      <IonIcon icon={trash} />
    </IonButton>

    const ownerIcon = this.props.owner && <IonButton className="button-end" fill="clear" size="large" slot="end"><Avatar size="30px" user={this.props.owner} /></IonButton>

    const itemDisplay = this.state.inEdit ?
      <EditItem
        item={item}
        onEditingConcluded={(item) => {
          this.setEditMode(false)
          this.props.onEditingConcluded(item)
        }
        }
        mode={this.props.mode}
      />
      :
      <>
        {this.props.mode === ITEM_TYPE_IN_SHOPPING && <IonCheckbox slot="start"
          value={item.name}
          checked={item.shopped}
          onClick={() => this.onItemClick()}
          color="primary"
        />}
        <IonLabel onClick={() => this.onItemClick()}
          style={{
            cursor: 'pointer',
            textDecoration: (item.shopped ? 'line-through' : 'none'),
            color: (item.shopped ? 'grey' : 'black')
          }}>
          {!(this.props.mode === ITEM_TYPE_BRING_ALONG) && item.name}
        </IonLabel>
        {ownerIcon}
        {quantityLabel}
        {needIcon}
        {deleteIcon}
      </>

    const dependentNeededItems = bringAlongItems && (
      <IonList>
        {bringAlongItems
          .map(neededItem => {
            const owner = this.props.userStore.users[neededItem.ownerId]
            return (
              <Item
                key={neededItem.id}
                item={neededItem}
                owner={owner}
                ownList={false}
                onShopItem={() => this.props.onShopItem(neededItem.id, !neededItem.shopped)}
                mode={ITEM_TYPE_BRING_ALONG} />
            )
          })
        }
      </IonList>
    )

    return (
      <>
        <IonItem id={item.uid}>
          <IonReorder slot="start" />
          {itemDisplay}
        </IonItem>
        {dependentNeededItems}
      </>
    )
  }
}

export default compose(
  inject('userStore'),
  observer,
)(Item);