import React, { Component } from 'react';
import { IonList } from '@ionic/react';
import Item from '../../Reusables/ionic/Item';
import { LIFECYCLE_STATUS_OPEN } from '../../../constants/lists';

class NeedsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: '',
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.list.name,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditNeedsList(this.props.list, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const {
      list,
      ownList,
      items,
      mode,
      onCreateItem,
      onEditItem,
      onDeleteItem
    } = this.props;

    return (
      <IonList>
        {(items || []).map((item, key) => (
          <Item
            key={item.id || key}
            item={item}
            onEditingConcluded={onEditItem}
            onDeleteItem={onDeleteItem}
            onCreateNeed={onCreateItem}
            mode={mode}
            ownList={ownList}
            readOnly={list && list.lifecycleStatus !== LIFECYCLE_STATUS_OPEN}
          />))
        }
      </IonList>
    );
  }
}

export default NeedsList;
