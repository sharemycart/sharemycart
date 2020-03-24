import React, { Component } from "react";
import { IonItem, IonButton, IonInput, IonList, IonSelect, IonSelectOption, IonLabel } from "@ionic/react";

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
    this.props.onChange({ ...this.props.item, [property]: value })
  }

  setUnit(unit) {
    this.props.onChange({ ...this.props.item, unit })
  }

  render() {
    const unitOfMeasure = this.props.mode === 'shopping'
      ? <IonSelect value={this.props.item.unit}
        placeholder="Select"
        onIonChange={e => this.setUnit(e.detail.value)
        }>
        <IonSelectOption>pc</IonSelectOption>
        <IonSelectOption>g</IonSelectOption>
        <IonSelectOption>kg</IonSelectOption>
        <IonSelectOption>l</IonSelectOption>
        <IonSelectOption>ml</IonSelectOption>
      </IonSelect>
      : <IonLabel>{this.props.item.unit}</IonLabel>

    return <IonList style={{ width: "100%", border: "1px solid lightgrey" }}>
      <IonItem>
        <IonInput
          autofocus={this.props.mode === "shopping"}
          placeholder="Item name"
          name="name"
          value={this.props.item.name}
          onKeyPress={event => this.onKeyPress(event)}
          onBlur={event => this.onBlur(event)}
          disabled={this.props.mode === "need"}
        />
      </IonItem>
      <IonItem>
        <IonInput
          autofocus={this.props.mode === "need"}
          placeholder="Quantity"
          name="quantity"
          value={this.props.item.quantity}
          onKeyPress={event => this.onKeyPress(event)}
          onBlur={event => this.onBlur(event)}
        />
        {unitOfMeasure}
      </IonItem>

      <IonButton onClick={this.props.onClose} style={{'margin': '8px 8px 0'}}>Done</IonButton>
    </IonList>
  }
}

export default EditItem
