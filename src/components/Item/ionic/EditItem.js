import React, { Component } from "react";
import { IonItem, IonButton, IonInput, IonList, IonSelect, IonSelectOption, IonLabel } from "@ionic/react";
import { ITEM_TYPE_SHOPPING, ITEM_TYPE_NEED } from "../../../constants/items";

const ENTER_KEY = 13;

class EditItem extends Component {
  constructor(props) {
    super(props);
    if (!props.item.unit) {
      // don't default the unit, it might be a bit overengineered
      // props.onChange({ ...this.props.item, unit: 'pc'})
    }
  }

  concludeEditing(item) {
    this.props.onEditingConcluded(item)
  }

  onChange(event) {
    const property = event.currentTarget.name
    const value = event.currentTarget.value
    this.props.onChange({ ...this.props.item, [property]: value })
  }

  setUnit(unit) {
    this.props.onChange({ ...this.props.item, unit })
  }

  render() {
    const unitOfMeasure = this.props.mode === ITEM_TYPE_SHOPPING
      ? <IonSelect
        value={this.props.item.unit}
        required="true"
        onIonChange={e => this.setUnit(e.detail.value)}
      >
        <IonSelectOption>pc</IonSelectOption>
        <IonSelectOption>g</IonSelectOption>
        <IonSelectOption>kg</IonSelectOption>
        <IonSelectOption>l</IonSelectOption>
        <IonSelectOption>ml</IonSelectOption>
      </IonSelect>
      : <IonLabel>{this.props.item.unit}</IonLabel>

    return (
      <IonItem style={{width: "100%"}}>
        <IonInput
          autofocus={this.props.mode === ITEM_TYPE_SHOPPING}
          placeholder="Item name"
          name="name"
          value={this.props.item.name}
          onIonChange={event => this.onChange(event)}
          // onIonBlur={event => this.props.onClose()}
          disabled={this.props.mode === ITEM_TYPE_NEED}
          required="true"
        />
        <IonInput
          autofocus={this.props.mode === ITEM_TYPE_NEED}
          placeholder="Quantity"
          name="quantity"
          type="number"
          min="0"
          pattern="\d+,?\d*"
          value={this.props.item.quantity}
          onIonChange={event => this.onChange(event)}
          // onIonBlur={event => }
          required="true"
        />
        {unitOfMeasure}
        <IonButton onClick={() => this.concludeEditing(this.props.item)} style={{ 'marginLeft': '10px' }}>Add</IonButton>
      </IonItem>
    )
  }
}

export default EditItem
