import React, { Component } from 'react';

class ShoppingItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.shoppingItem.name,
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.shoppingItem.name,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditShoppingItem(this.props.shoppingItem, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { authUser, shoppingItem, onRemoveShoppingItem, onSetCurrentShoppingItem } = this.props;
    const { editMode, editText } = this.state;

    return (
      <li>
        {editMode ? (
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
            <span>
              <strong>{shoppingItem.userId}</strong> {shoppingItem.name}
              {shoppingItem.editedAt && <span>(Edited)</span>}
              {shoppingItem.isCurrent && <span>(Current)</span>}
            </span>
          )}

        {authUser.uid === shoppingItem.userId && (
          <span>
            {editMode ? (
              <span>
                <button onClick={this.onSaveEditText}>Save</button>
                <button onClick={this.onToggleEditMode}>Reset</button>
              </span>
            ) : (
                <button onClick={this.onToggleEditMode}>Edit</button>
              )}

            {!editMode && (
              <span>
                <button
                  type="button"
                  onClick={() => onRemoveShoppingItem(shoppingItem.uid)}
                >
                  Delete
              </button>
                <button
                  type="button"
                  onClick={() => onSetCurrentShoppingItem(shoppingItem.uid)}
                >
                  Current
              </button>
              </span>
            )}
          </span>
        )}
      </li>
    );
  }
}

export default ShoppingItem;
