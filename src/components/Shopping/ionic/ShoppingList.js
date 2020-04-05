import React, { Component } from 'react';
import Item from '../../Item/ionic/Item';
import EditItem from '../../Item/ionic/EditItem';
import { IonList, IonItem, IonReorderGroup, IonButton, IonToolbar, IonButtons, IonIcon, IonTitle } from '@ionic/react';
import { ITEM_TYPE_SHOPPING } from '../../../constants/items';

class ShoppingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editName: this.props.list.name,
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editName: this.props.list.name,
    }));
  };

  onChangeEditName = event => {
    this.setState({ editName: event.target.value });
  };

  onSaveEditName = () => {
    this.props.onEditList(this.props.list, this.state.editName);

    this.setState({ editMode: false });
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
      onDeleteItem
    } = this.props;

    const EditButton = () => (
      !this.state.editMode && <IonButton color="danger" fill="clear"
        onClick={() => this.setState({ editMode: true })}>
        {'Edit'}
        <IonIcon slot="end" name="create" />
      </IonButton>
    )

    const SaveButton = () => (
      this.state.editMode && <IonButton color="danger" fill="clear"
        onClick={() => this.saveEdit()}>
        {'Save'}
        <IonIcon slot="end" name="create" />
      </IonButton>
    )

    return (
      <>
        <IonToolbar>
          <IonButtons slot="secondary">
            <IonButton fill="clear">
              Go Shopping
      </IonButton>
          </IonButtons>
          <IonTitle>{this.props.list.name}</IonTitle>
          <IonButtons slot="primary">
            <EditButton />
            <SaveButton />
          </IonButtons>
        </IonToolbar>
        <IonList>
          <IonItem>
            <EditItem
              onEditingConcluded={this.onCreateComplete.bind(this)}
              mode={ITEM_TYPE_SHOPPING}
            />
          </IonItem>
        </IonList>
        <IonList>
        {/* // The following component is actually a hack. I expected the IonReorderGroup to 
        // toggle "disabled" based on the edit mode.
        // However, whit does not work as expected, as when leaving back to non-Edit-mode, 
        // the oder is destroyed until loaded from the database for the next time */}
          {
            this.state.editMode && <IonReorderGroup disabled={false} onIonItemReorder={this.doReorder.bind(this)}>
              {items.map((item, key) => (
                <Item
                  key={item.id || key}
                  item={item}
                  ownList={true}
                  onEditingConcluded={onEditItem}
                  onDeleteItem={onDeleteItem}
                  mode={ITEM_TYPE_SHOPPING}
                />))}
            </IonReorderGroup>
          }
          {
            !this.state.editMode && items.map((item, key) => (
              <Item
                key={item.id || key}
                item={item}
                ownList={true}
                onEditingConcluded={onEditItem}
                onDeleteItem={onDeleteItem}
                mode={ITEM_TYPE_SHOPPING}
              />))
          }
        </IonList>
      </>
    );
  }
}

export default ShoppingList;
