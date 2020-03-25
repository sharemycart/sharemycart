import React, { Component } from "react";
import { IonItem, IonButton, IonInput, IonList, IonSelect, IonSelectOption, IonLabel } from "@ionic/react";

const ENTER_KEY = 13;

class EditItem extends Component {
  constructor(props) {
    super(props);
    if (!props.item.unit) {
      props.onChange({ ...this.props.item, unit: 'pc'})
    }
  }

  onKeyPress(event) {
    if (event.which === ENTER_KEY) {
      this.onBlur(event)
    }
  }

  onBlur(event) {
    const property = event.target.name
    const value = event.target.value
    this.props.onChange({ ...this.props.item, [property]: value })
  }

  setUnit(unit) {
    this.props.onChange({ ...this.props.item, unit })
  }

  render() {
    const unitOfMeasure = this.props.mode === 'shopping'
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

    return <IonList style={{ width: "100%" }}>
      <IonItem>
        <IonInput
          autofocus={this.props.mode === "shopping"}
          placeholder="Item name"
          name="name"
          value={this.props.item.name}
          onKeyPress={event => this.onKeyPress(event)}
          onBlur={event => this.onBlur(event)}
          disabled={this.props.mode === "need"}
          required="true"
        />
        <IonInput
          autofocus={this.props.mode === "need"}
          placeholder="Quantity"
          name="quantity"
          type="number"
          min="0"
          pattern="\d+,?\d*"
          value={this.props.item.quantity}
          onKeyPress={event => this.onKeyPress(event)}
          onBlur={event => this.onBlur(event)}
          required="true"
        />
        {unitOfMeasure}
        <IonButton onClick={this.props.onClose} style={{'margin-left': '10px'}}>Add</IonButton>
      </IonItem>

    </IonList>
  }
}

export default EditItem
