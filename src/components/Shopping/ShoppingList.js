import React, { Component } from 'react';

class ShoppingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.shoppingList.name,
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.shoppingList.name,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditShoppingList(this.props.shoppingList, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { authUser, shoppingList, onRemoveShoppingList, onSetCurrentShoppingList } = this.props;
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
              <strong>{shoppingList.userId}</strong> {shoppingList.name}
              {shoppingList.editedAt && <span>(Edited)</span>}
              {shoppingList.isCurrent && <span>(Current)</span>}
            </span>
          )}

        {authUser.uid === shoppingList.userId && (
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
                  onClick={() => onRemoveShoppingList(shoppingList.uid)}
                >
                  Delete
              </button>
                <button
                  type="button"
                  onClick={() => onSetCurrentShoppingList(shoppingList.uid)}
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

export default ShoppingList;
