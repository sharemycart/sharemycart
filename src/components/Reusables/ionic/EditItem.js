import React, { Component } from "react";
import { IonItem, IonButton, IonInput, IonSelect, IonSelectOption, IonLabel, IonIcon, IonToast } from "@ionic/react";
import { ITEM_TYPE_SHOPPING, ITEM_TYPE_NEED } from "../../../constants/items";

import { withTranslation } from 'react-i18next';
import { cartOutline } from "ionicons/icons";
import { ENTER } from "../keys";

class EditItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.item,
      showToast: false,
      message: "",
    }

    this.nameInput = React.createRef()
    this.quantityInput = React.createRef()
  }

  concludeEditing() {
    const { t } = this.props;
    const { name, quantity, unit } = this.state
    if (name && quantity) {
      this.props.onEditingConcluded({
        uid: this.props.item.uid,
        name,
        quantity,
        unit,
      })
    } else {
      this.setState({
        showToast: true,
        message: t('Name_and_quantity_mandatory')
      })
    }
    this.quantityInput.current.setFocus()
  }

  componentDidMount() {
    setTimeout(() => this.quantityInput.current.setFocus(), 500 )
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

    const unitOfMeasure = this.props.mode === ITEM_TYPE_SHOPPING
      ? <IonSelect
        value={unit}
        required="true"
        onIonChange={e => this.setUnit(e.detail.value)}
      >
        <IonSelectOption>pc</IonSelectOption>
        <IonSelectOption>g</IonSelectOption>
        <IonSelectOption>kg</IonSelectOption>
        <IonSelectOption>l</IonSelectOption>
        <IonSelectOption>ml</IonSelectOption>
      </IonSelect>
      : <IonLabel>{unit}</IonLabel>

    return (
      <>
        <IonItem style={{ width: "100%" }}>
          <IonInput
            // autofocus={this.props.mode === ITEM_TYPE_NEW_SHOPPING && !name}
            placeholder={t('Item name')}
            name="name"
            value={name}
            onIonInput={event => this.onKeyPress(event)}
            onIonChange={event => this.onChange(event)}
            onIonBlur={event => this.onBlur(event)}
            readonly={this.props.mode === ITEM_TYPE_NEED}
            required="true"
            autocapitalize
            autocorrect="on"
            debounce="100"
            ref={this.nameInput}
          />
          <IonInput
            // autofocus={(this.props.mode === ITEM_TYPE_NEED) || (this.props.mode === ITEM_TYPE_SHOPPING && name)}
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

export default withTranslation()(EditItem)
