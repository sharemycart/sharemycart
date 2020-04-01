import React, { Component } from 'react';
import Item from '../../Item/ionic/Item';
import EditItem from '../../Item/ionic/EditItem';
import { IonList, IonItem } from '@ionic/react';
import { ITEM_TYPE_SHOPPING } from '../../../constants/items';

class ShoppingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editName: this.props.list.name,
      newItem: {},
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
    this.props.onEditShoppingList(this.props.list, this.state.editName);

    this.setState({ editMode: false });
  };

  onChangeNewItem(newItem) {
    this.setState({ newItem });
  }

  onCreateComplete() {
    let { newItem } = this.state;

    if (!newItem.name || !newItem.quantity) {
      return;
    }

    this.props.onCreateItem(newItem)
      .then(() => {
        this.setState({ newItem: {} });
      });
  }

  render() {
    const {
      authUser,
      list,
      items,
      dependentNeedLists,
      onEditItem,
      onDeleteItem
    } = this.props;

    const { editMode, editName, newItem } = this.state;

    return (
      <>
        <IonList>
          <IonItem>
            <EditItem item={newItem}
              onChange={this.onChangeNewItem.bind(this)}
              onEditingConcluded={this.onCreateComplete.bind(this)}
              mode={ITEM_TYPE_SHOPPING}
            />
          </IonItem>
        </IonList>
        <IonList>
          {items.map((item, key) => (
            <Item
              key={item.id || key}
              item={item}
              ownList={true}
              onEditingConcluded={onEditItem}
              onDeleteItem={onDeleteItem}
              mode={ITEM_TYPE_SHOPPING}
            />))}
        </IonList>
      </>
    );
  }
}

export default ShoppingList;
