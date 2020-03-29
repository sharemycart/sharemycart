import React, { Component } from 'react';

class NeededItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.neededItem.name,
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.neededItem.name,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    const item = this.props.neededItem;
    item.name = this.state.editText;
    this.props.onEditNeededItem(item);

    this.setState({ editMode: false });
  };

  render() {
    const { authUser, neededItem, onRemoveNeededItem } = this.props;
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
              {neededItem.name}
              {neededItem.editedAt && <span>(Edited)</span>}
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
                  onClick={() => onRemoveNeededItem(neededItem.uid)}
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

export default NeededItem;
