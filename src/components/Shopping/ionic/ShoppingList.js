import React, { Component } from 'react';
import Item from '../../Reusables/ionic/Item';
import EditItem from '../../Reusables/ionic/EditItem';
import { IonList, IonItem, IonReorderGroup } from '@ionic/react';
import { ITEM_TYPE_NEW_SHOPPING } from '../../../constants/items';

class ShoppingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editName: this.props.list.name,
    };

    this.props.addSaveEditHandler(this.saveEdit.bind(this))
  }

  onChangeEditName = event => {
    this.setState({ editName: event.target.value });
  };

  onSaveEditName = () => {
    this.props.onEditList(this.props.list, this.state.editName);
  };

  onChangeNewItem(newItem) {
    this.setState({ newItem });
  }

  onCreateComplete(newItem) {
    if (!newItem.name || !newItem.quantity) {
      return;
    }

    this.props.onCreateItem(newItem)
  }

  doReorder(event) {
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

    event.detail.complete()

    const { children } = event.srcElement
    let order = {}
    event.detail.complete();
    let position = 0
    for (let k in children) {
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


    return (
      <>
        <IonList>
          <IonItem>
            <EditItem
              onEditingConcluded={this.onCreateComplete.bind(this)}
              mode={ITEM_TYPE_NEW_SHOPPING}
            />
          </IonItem>
        </IonList>
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
                <Item
                  key={item.id || key}
                  item={item}
                  bringAlongItems={relatedBringAlongItems}
                  ownList={true}
                  onEditingConcluded={onEditItem}
                  onDeleteItem={onDeleteItem}
                  onShopItem={onShopItem}
                  mode={this.props.mode}
                />)
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
                  mode={this.props.mode}
                />))}
            </IonReorderGroup>
          }
        </IonList>
      </>
    );
  }
}

export default ShoppingList;
