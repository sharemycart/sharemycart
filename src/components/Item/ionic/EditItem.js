import React, { Component } from "react";
import { IonItem, IonButton, IonInput, IonSelect, IonSelectOption, IonLabel } from "@ionic/react";
import { ITEM_TYPE_SHOPPING, ITEM_TYPE_NEED } from "../../../constants/items";

const ENTER_KEY = 13;

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: Object.assign({
        name: '',
        quantity: '',
        unit: '',
      }, props.item)
    }

    this.nameInput = React.createRef()
    this.quantityInput = React.createRef()
  }

  concludeEditing() {
    this.props.onEditingConcluded(this.state.item)
    this.setState({
      item: Object.assign({
        name: '',
        quantity: '',
        unit: '',
      }, this.props.item)
    })


    if (this.props.mode === ITEM_TYPE_SHOPPING) {
      setTimeout(this.nameInput.current.focus(), 1000)
    } else {
      setTimeout(this.quantityInput.current.focus(), 1000)
    }
  }

  onChange(event) {
    const property = event.currentTarget.name
    const value = event.currentTarget.value
    this.setState({ item: { ...this.state.item, [property]: value } })
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
    this.props.onChange({ ...this.props.item, unit })
  }

  render() {
    const { item } = this.state;

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
      <IonItem style={{ width: "100%" }}>
        <IonInput
          // autofocus={this.props.mode === ITEM_TYPE_SHOPPING && !item.name}
          placeholder="Item name"
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
          placeholder="Quantity"
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
        <IonButton onClick={() => this.concludeEditing()} style={{ 'marginLeft': '10px' }}>Add</IonButton>
      </IonItem>
    )
  }
}

export default EditItem
