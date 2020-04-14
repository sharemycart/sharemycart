import React, { Component } from 'react';
import Item from '../../Item/ionic/Item';
import { IonList, IonReorderGroup, IonItemOptions, IonItemOption, IonItemSliding, IonIcon } from '@ionic/react';
import { LIFECYCLE_STATUS_OPEN } from '../../../constants/lists';
import { trashOutline } from 'ionicons/icons';

class ShoppingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editName: this.props.list.name,
    };

    if (this.props.addSaveEditHandler) {
      this.props.addSaveEditHandler(this.saveEdit.bind(this))
    }
  }

  onChangeEditName = event => {
    this.setState({ editName: event.target.value });
  };

  onSaveEditName = () => {
    this.props.onEditList(this.props.list, this.state.editName);
  };

  doReorder(event) {
    event.detail.complete()

    const { children } = event.srcElement
    let order = {}
    event.detail.complete();
    let position = 0

    // eslint-disable-next-line
    for (const k in children) {
      position++;
      if (children.hasOwnProperty(k)) {
        if (children[k].id) {
          order[children[k].id] = position
        }
      }
    }

    this.setState({ order })
  }

  saveEdit() {
    this.onSaveEditName()
    if (this.state.order) {
      this.props.onReorderItems(this.props.list.uid, this.props.items, this.state.order)
    }
  }

  render() {
    const {
      items,
      onEditItem,
      onDeleteItem,
      onShopItem,
    } = this.props;

    const ItemSlidingOptions = ({ item }) => (
      <IonItemOptions
        onIonSwipe={
          () => onDeleteItem(item.uid)
        }
      >
        <IonItemOption color="danger" expandable
        // onClick={() => onDeleteItem(item.uid)}
        >
          <IonIcon slot="icon-only" icon={trashOutline} />
        </IonItemOption>
      </IonItemOptions>
    )

    return (
      <>
        <IonList>
          {/* // The following component is actually a hack. I expected the IonReorderGroup to 
        // toggle "disabled" based on the edit mode.
        // However, whit does not work as expected, as when leaving back to non-Edit-mode, 
        // the oder is destroyed until loaded from the database for the next time */}

          {
            !this.props.editMode && items.map((item, key) => {
              const relatedBringAlongItems = (this.props.bringAlongItems || [])
                .filter(
                  neededItem => (
                    (item.uid === neededItem.originShoppingItemId)
                    || (item.name === neededItem.name)
                  ) && neededItem.quantity
                )
              return (
                <IonItemSliding key={item.id || key}>
                  <ItemSlidingOptions item={item} />
                  <Item
                    item={item}
                    bringAlongItems={relatedBringAlongItems}
                    ownList={true}
                    onEditingConcluded={onEditItem}
                    onDeleteItem={onDeleteItem}
                    onShopItem={onShopItem}
                    mode={this.props.mode}
                    readOnly={this.props.list.lifecycleStatus !== LIFECYCLE_STATUS_OPEN}
                    listEditMode={this.props.editMode}
                  />
                </IonItemSliding>
              )
            })
          }
          {
            this.props.editMode && <IonReorderGroup disabled={false} onIonItemReorder={this.doReorder.bind(this)}>
              {items.map((item, key) => (
                <Item
                  key={item.id || key}
                  item={item}
                  ownList={true}
                  onEditingConcluded={onEditItem}
                  onDeleteItem={onDeleteItem}
                  onShopItem={onShopItem}
                  mode={this.props.mode}
                  readOnly={this.props.list.lifecycleStatus !== LIFECYCLE_STATUS_OPEN}
                  listEditMode={this.props.editMode}
                />))}
            </IonReorderGroup>
          }
        </IonList>
      </>
    );
  }
}

export default ShoppingList;
