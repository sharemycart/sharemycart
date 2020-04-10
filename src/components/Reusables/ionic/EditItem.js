import React, { Component } from 'react';
import {
  IonItem, IonButton, IonInput, IonSelect, IonSelectOption, IonLabel, IonIcon, IonToast,
} from '@ionic/react';

import { withTranslation } from 'react-i18next';
import { cartOutline } from 'ionicons/icons';
import { ITEM_TYPE_SHOPPING, ITEM_TYPE_NEW_SHOPPING, ITEM_TYPE_NEED } from '../../../constants/items';

const ENTER_KEY = 13;
const EMPTY_ITEM = {
  name: '',
  quantity: '',
  unit: '',
};

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.item || EMPTY_ITEM,
      showToast: false,
      message: '',
    };

    this.nameInput = React.createRef();
    this.quantityInput = React.createRef();
  }

  concludeEditing() {
    const { t } = this.props;
    const { item } = this.state;
    if (item.name && item.quantity) {
      this.props.onEditingConcluded(item);
      if (this.props.mode === ITEM_TYPE_NEW_SHOPPING) {
        this.setState({ item: EMPTY_ITEM });
      }
    } else {
      this.setState({
        showToast: true,
        message: t('Name_and_quantity_mandatory'),
      });
    }

    if (this.props.mode === ITEM_TYPE_NEW_SHOPPING) {
      this.nameInput.current.setFocus();
    } else {
      this.quantityInput.current.setFocus();
    }
  }

  onChange(event) {
    const property = event.currentTarget.name;
    const { value } = event.currentTarget;
    this.setState({ item: { ...this.state.item, [property]: value } });
  }

  onKeyPress = (event) => {
    event.which === ENTER_KEY && this.concludeEditing();
  }

  onBlur(event) {
    if (event.target.parentElement !== event.srcElement.parentElement) {
      this.concludeEditing();
    }
  }

  setUnit(unit) {
    this.setState({ item: { ...this.state.item, unit } });
  }

  render() {
    const { item } = this.state;

    const { t } = this.props;

    const unitOfMeasure = (this.props.mode === ITEM_TYPE_SHOPPING || this.props.mode === ITEM_TYPE_NEW_SHOPPING)
      ? (
        <IonSelect
          value={item.unit}
          required="true"
          onIonChange={(e) => this.setUnit(e.detail.value)}
        >
          <IonSelectOption>pc</IonSelectOption>
          <IonSelectOption>g</IonSelectOption>
          <IonSelectOption>kg</IonSelectOption>
          <IonSelectOption>l</IonSelectOption>
          <IonSelectOption>ml</IonSelectOption>
        </IonSelect>
      )
      : <IonLabel>{item.unit}</IonLabel>;

    return (
      <>
        <IonItem style={{ width: '100%' }}>
          <IonInput
            // autofocus={this.props.mode === ITEM_TYPE_NEW_SHOPPING && !item.name}
            placeholder={t('Item name')}
            name="name"
            value={item.name}
            onIonInput={(event) => this.onKeyPress(event)}
            onIonChange={(event) => this.onChange(event)}
            onIonBlur={(event) => this.onBlur(event)}
            readonly={this.props.mode === ITEM_TYPE_NEED}
            required="true"
            autocapitalize
            autocorrect="on"
            debounce="100"
            ref={this.nameInput}
          />
          <IonInput
            // autofocus={(this.props.mode === ITEM_TYPE_NEED) || (this.props.mode === ITEM_TYPE_SHOPPING && item.name)}
            placeholder={t('Quantity')}
            name="quantity"
            type="number"
            min="0"
            pattern="\d+,?\d*"
            value={item.quantity}
            onKeyUp={this.onKeyPress}
            onIonChange={(event) => this.onChange(event)}
            onIonBlur={(event) => this.onBlur(event)}
            required="true"
            ref={this.quantityInput}
          />
          {unitOfMeasure}
          <IonButton onClick={() => this.concludeEditing()} style={{ marginLeft: '10px' }}>
            <IonIcon icon={cartOutline} />
          </IonButton>
        </IonItem>
        <IonToast
          isOpen={this.state.showToast}
          onDidDismiss={() => this.setState(() => ({ showToast: false }))}
          message={this.state.message}
          duration={3000}
        />
      </>
    );
  }
}

export default withTranslation()(EditItem);
