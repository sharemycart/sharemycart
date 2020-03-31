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
    const item = this.props.shoppingItem;
    item.name = this.state.editText;
    this.props.onEditShoppingItem(item);

    this.setState({ editMode: false });
  };

  render() {
    const { authUser, shoppingItem, onRemoveShoppingItem } = this.props;
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
              {shoppingItem.name}
              {shoppingItem.editedAt && <span>(Edited)</span>}
            </span>
          )}

        {authUser.uid && (
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
              </span>
            )}
          </span>
        )}
      </li>
    );
  }
}

export default ShoppingItem;
