import React, { Component } from "react";
import { IonItem, IonButton, IonInput, IonSelect, IonSelectOption, IonIcon, IonToast } from "@ionic/react";

import { withTranslation } from 'react-i18next';
import { cartOutline } from "ionicons/icons";
import { ENTER } from "../../Reusables/keys";

const EMPTY_ITEM = {
  name: '',
  quantity: '',
  unit: '',
}

class CreateShoppingItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...EMPTY_ITEM,
      showToast: false,
      message: "",
    }

    this.nameInput = React.createRef()
    this.quantityInput = React.createRef()
  }

  concludeEditing() {
    const { t } = this.props;
    const { name, quantity, unit = ''} = this.state
    if (name && quantity) {
      this.props.onEditingConcluded({
        name,
        quantity,
        unit,
      })
      this.setState({ ...EMPTY_ITEM })
    } else {
      this.setState({
        showToast: true,
        message: t('Name_and_quantity_mandatory')
      })
    }

    this.nameInput.current.setFocus()
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
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

  render() {
    const { name, quantity, unit } = this.state;

    const { t } = this.props;

    const unitOfMeasure = 
      <IonSelect
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

export default withTranslation()(CreateShoppingItem)
