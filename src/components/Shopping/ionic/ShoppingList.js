import React, { Component } from 'react';
import Item from '../../Item/ionic/Item';
import EditItem from '../../Item/ionic/EditItem';
import { IonList } from '@ionic/react';

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
    let {newItem} = this.state;
    
		if (!newItem.name || !newItem.quantity || !newItem.unit) {
			return;
		}
		this.props.onCreateItem({ listId: this.state.list.id, item: newItem })
			.then(() => {
				console.log('item added successfully');
			});
	}

  render() {
    const {
      authUser,
      list,
      items,
      dependentNeedLists,
      onEdit,
      onEditItem,
      onRemoveItem
    } = this.props;
    
    const { editMode, editName, newItem } = this.state;

    return (
      <>
        {/* <EditItem item={newItem}
          onChange={this.onChangeNewItem}
          onClose={this.onCreateComplete}
          mode="shopping"
        /> */}
        <IonList>
          {items.map((item, key) => (
            <Item
            key={item.id || key}
            item={item}
            ownList={true}
            onUpdateItem={onEditItem}
            onDeleteItem={onRemoveItem}
            mode={'shopping'}
          />))}
        </IonList>
      </>
    );
  }
}

export default ShoppingList;
