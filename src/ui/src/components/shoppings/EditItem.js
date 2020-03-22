import React, { Component } from "react";
import { IonItem, IonButton, IonInput, IonList, IonSelect, IonSelectOption } from "@ionic/react";

const ENTER_KEY = 13;

class EditItem extends Component {
  onKeyPress(event) {
    if (event.which === ENTER_KEY) {
      this.onBlur(event)
    }
  }

  onBlur(event) {
    const property = event.target.name
    const value = event.target.value
    this.props.onChange({...this.props.item, [property]: value})
  }

  setUnit(unit) {
    this.props.onChange({...this.props.item, unit})
  }

  render() {
    return <IonList style={{ width: "100%", border: "1px solid lightgrey" }}>
      <IonItem>
        <IonInput
          autofocus="true"
          placeholder="Item name"
          name="name"
          value={this.props.item.name}
          onKeyPress={event => this.onKeyPress(event)}
          onBlur={event => this.onBlur(event)}
        />
      </IonItem>
      <IonItem>
        <IonInput
          placeholder="Quantity"
          name="quantity"
          value={this.props.item.quantity}
          onKeyPress={event => this.onKeyPress(event)}
          onBlur={event => this.onBlur(event)}
        />
        <IonSelect value={this.props.item.unit} placeholder="Select" onIonChange={e => this.setUnit(e.detail.value)}>
          <IonSelectOption>g</IonSelectOption>
          <IonSelectOption>kg</IonSelectOption>
          <IonSelectOption>l</IonSelectOption>
          <IonSelectOption>ml</IonSelectOption>
          <IonSelectOption>pc</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonButton onClick={this.props.onClose}>Close</IonButton>
    </IonList>
  }
}

export default EditItem
