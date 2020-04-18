import React, { Component } from 'react';
import Item from '../../Item/ionic/Item';
import { IonList, IonReorderGroup, IonToggle, IonLabel, IonItem } from '@ionic/react';
import { LIFECYCLE_STATUS_OPEN } from '../../../constants/lists';
import { Trans } from 'react-i18next';

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
      list,
      onEditList,
      onEditItem,
      onDeleteItem,
      onShopItem,
      editMode,
    } = this.props;


    return (
      <>
        <IonList>
          {/* // The following component is actually a hack. I expected the IonReorderGroup to 
        // toggle "disabled" based on the edit mode.
        // However, whit does not work as expected, as when leaving back to non-Edit-mode, 
        // the oder is destroyed until loaded from the database for the next time */}

          {
            !editMode && items.map((item, key) => {
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
                  readOnly={this.props.list.lifecycleStatus !== LIFECYCLE_STATUS_OPEN}
                />)
            })
          }
          {
            editMode &&
            <>
              <IonItem lines="none">
                <IonLabel><Trans>Allow friends to add own needs</Trans></IonLabel>
                <IonToggle
                  name="allowCreateOwnNeeds"
                  checked={list.allowCreateOwnNeeds}
                  onIonChange={() => {
                    onEditList(Object.assign(list, { allowCreateOwnNeeds: !list.allowCreateOwnNeeds }))
                  }}
                />
              </IonItem>
              <IonReorderGroup disabled={false} onIonItemReorder={this.doReorder.bind(this)}>
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
                    listEditMode={editMode}
                  />))}
              </IonReorderGroup>
            </>
          }
        </IonList>
      </>
    );
  }
}

export default ShoppingList;
