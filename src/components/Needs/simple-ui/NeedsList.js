import React, { Component } from 'react';

class NeedsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.needsList.name,
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.needsList.name,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditNeedsList(this.props.needsList, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { authUser, needsList, onRemoveNeedsList, onSetCurrentNeedsList } = this.props;
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
              <pre>{needsList.uid}</pre> {needsList.name}
              {needsList.editedAt && <span>(Edited)</span>}
              {needsList.isCurrent && <span>(Current)</span>}
            </span>
          )}

        {authUser.uid === needsList.userId && (
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
                  onClick={() => onRemoveNeedsList(needsList.uid)}
                >
                  Delete
              </button>
                <button
                  type="button"
                  onClick={() => onSetCurrentNeedsList(needsList.uid)}
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

export default NeedsList;
