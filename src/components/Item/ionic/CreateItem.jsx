import React, { Component } from "react";
import { IonItem, IonButton, IonInput, IonSelect, IonSelectOption, IonIcon, IonToast, IonLabel } from "@ionic/react";

import { withTranslation } from 'react-i18next';
import { cartOutline } from "ionicons/icons";
import { ENTER } from "../../Reusables/keys";
import { ITEM_TYPE_NEED } from "../../../constants/items";

const EMPTY_ITEM = {
  name: '',
  quantity: '',
  unit: '',
}

class CreateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      message: "",
    }

    this.nameInput = React.createRef()
    this.quantityInput = React.createRef()
  }

  _setFocus() {
    if (!this.props.item.name) {
      setTimeout(() =>
        this.nameInput.current && this.nameInput.current.setFocus()
        , 500)
    } else {
      setTimeout(() =>
        this.quantityInput.current && this.quantityInput.current.setFocus()
        , 500)
    }
  }

  concludeEditing() {
    const { t } = this.props;
    const { name, quantity, unit = '' } = this.props.item
    if (name) {
      this.props.onEditingConcluded({
        name,
        quantity: quantity || 1,
        unit,
      })
    } else {
      this.setState({
        showToast: true,
        message: t('Name_mandatory')
      })
    }

    this._setFocus()
  }

  onChange(event) {
    this.props.onChange(event)
  }

  onKeyPress = (event) => {
    event.which === ENTER && this.concludeEditing()
  }

  onBlur(event) {
    if (event.target.parentElement !== event.srcElement.parentElement) {
      this.concludeEditing()
    }
  }

  setUnit(unit) {
    this.setState({ unit });
  }

  componentDidMount() {
    this._setFocus()
  }

  render() {
    const { name, quantity, unit } = this.props.item;

    const { t } = this.props;

    const unitOfMeasure =
      this.props.mode === ITEM_TYPE_NEED
        ? <IonLabel>{unit}</IonLabel>
        : <IonSelect
          value={unit}
          required="true"
          onIonChange={e => this.setUnit(e.detail.value)}>
          <IonSelectOption>pc</IonSelectOption>
          <IonSelectOption>g</IonSelectOption>
          <IonSelectOption>kg</IonSelectOption>
          <IonSelectOption>l</IonSelectOption>
          <IonSelectOption>ml</IonSelectOption>
        </IonSelect>

    return (
      <>
        <IonItem style={{ width: "100%" }}>
          <IonInput
            placeholder={t('Item name')}
            name="name"
            value={name}
            readonly={this.props.mode === ITEM_TYPE_NEED}
            onKeyUp={this.onKeyPress}
            onIonInput={event => this.onKeyPress(event)}
            onIonChange={event => this.onChange(event)}
            onIonBlur={event => this.onBlur(event)}
            required="true"
            autocapitalize
            autocorrect="on"
            debounce="100"
            ref={this.nameInput}
          />
          <IonInput
            placeholder={t("Quantity")}
            name="quantity"
            type="number"
            min="0"
            pattern="\d+,?\d*"
            value={quantity}
            onKeyUp={this.onKeyPress}
            onIonChange={event => this.onChange(event)}
            onIonBlur={event => this.onBlur(event)}
            required="false"
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

export default withTranslation()(CreateItem)
