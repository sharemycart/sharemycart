import React, { Component } from "react";
import { IonItem, IonButton, IonInput, IonSelect, IonSelectOption, IonLabel, IonIcon, IonToast } from "@ionic/react";
import { ITEM_TYPE_SHOPPING, ITEM_TYPE_NEED } from "../../../constants/items";

import { withTranslation } from 'react-i18next';
import { cartOutline } from "ionicons/icons";

const ENTER_KEY = 13;

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: Object.assign({
        name: '',
        quantity: '',
        unit: '',
      }, props.item),
      showToast: false,
      message: ""
    }

    this.nameInput = React.createRef()
    this.quantityInput = React.createRef()
  }

  concludeEditing() {
    const { t } = this.props;
    const {item} = this.state
    if (item.name && item.quantity) {
      this.props.onEditingConcluded(item)
      this.setState({
        item: Object.assign({
          name: '',
          quantity: '',
          unit: '',
        }, this.props.item)
      })
    } else {
      this.setState({
        showToast: true,
        message: t('Name_and_quantity_mandatory')
      })
    }

    // This was a try to get the inputs focused after submit
    // does not work, as it seems keeping it for reference
    // if (this.props.mode === ITEM_TYPE_SHOPPING) {
    //   setTimeout(this.nameInput.current.focus(), 1000)
    // } else {
    //   setTimeout(this.quantityInput.current.focus(), 1000)
    // }
  }

  onChange(event) {
    const property = event.currentTarget.name
    const value = event.currentTarget.value
    this.setState({ item: { ...this.props.item, [property]: value } })
  }

  onKeyPress = (event) => {
    event.which === ENTER_KEY && this.concludeEditing()
  }

  onBlur(event) {
    if (event.target.parentElement !== event.srcElement.parentElement) {
      this.concludeEditing()
    }
  }

  setUnit(unit) {
    this.setState({ item: { ...this.state.item, unit } })
  }

  render() {
    const { item } = this.state;

    const { t } = this.props;

    const unitOfMeasure = this.props.mode === ITEM_TYPE_SHOPPING
      ? <IonSelect
        value={item.unit}
        required="true"
        onIonChange={e => this.setUnit(e.detail.value)}
      >
        <IonSelectOption>pc</IonSelectOption>
        <IonSelectOption>g</IonSelectOption>
        <IonSelectOption>kg</IonSelectOption>
        <IonSelectOption>l</IonSelectOption>
        <IonSelectOption>ml</IonSelectOption>
      </IonSelect>
      : <IonLabel>{item.unit}</IonLabel>

    return (
      <>
        <IonItem style={{ width: "100%" }}>
          <IonInput
            // autofocus={this.props.mode === ITEM_TYPE_SHOPPING && !item.name}
            placeholder={t('Item name')}
            name="name"
            value={item.name}
            onIonInput={event => this.onKeyPress(event)}
            onIonChange={event => this.onChange(event)}
            onIonBlur={event => this.onBlur(event)}
            disabled={this.props.mode === ITEM_TYPE_NEED}
            required="true"
            ref={this.nameInput}
          />
          <IonInput
            // autofocus={(this.props.mode === ITEM_TYPE_NEED) || (this.props.mode === ITEM_TYPE_SHOPPING && item.name)}
            placeholder={t("Quantity")}
            name="quantity"
            type="number"
            min="0"
            pattern="\d+,?\d*"
            value={item.quantity}
            onKeyUp={this.onKeyPress}
            onIonChange={event => this.onChange(event)}
            onIonBlur={event => this.onBlur(event)}
            required="true"
            ref={this.quantityInput}
          />
          {unitOfMeasure}
          <IonButton onClick={() => this.concludeEditing()} style={{ 'marginLeft': '10px' }}>
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
    )
  }
}

export default withTranslation()(EditItem)
