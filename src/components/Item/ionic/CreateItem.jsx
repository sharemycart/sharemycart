import React, { Component } from "react";
import { IonItem, IonButton, IonInput, IonSelect, IonSelectOption, IonIcon, IonToast, IonLabel } from "@ionic/react";

import { withTranslation } from 'react-i18next';
import { addOutline } from "ionicons/icons";
import { ENTER } from "../../Reusables/keys";
import { ITEM_TYPE_NEED } from "../../../constants/items";

import './createItem.scss'
import units from "../units";
import parseName from "../parseName";

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
    if (this.state.name) {
      setTimeout(() =>
        this.quantityInput.current && this.quantityInput.current.setFocus()
        , 100)
    } else {
      setTimeout(() =>
        this.nameInput.current && this.nameInput.current.setFocus()
        , 100)
    }
  }

  concludeEditing() {
    const { t } = this.props;
    const { name, quantity, unit = '' } = this.props.item
    if (name) {
      if (!quantity && !unit) {
        this.props.onEditingConcluded(parseName(name))
      } else {
        this.props.onEditingConcluded({
          name,
          quantity: quantity || 1,
          unit,
        })
      }
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
    const { name, quantity, unit, originShoppingItemUid } = this.props.item;

    const { t, isFirstItem, highlight } = this.props;

    const unitOfMeasure =
      this.props.mode === ITEM_TYPE_NEED
        ? <IonLabel
          slot="end"
          className="hide-sm-down"
        >{unit}</IonLabel>
        : <IonSelect
          value={unit}
          required="true"
          slot="end"
          style={{ marginRight: "0px" }}
          onIonChange={e => this.setUnit(e.detail.value)}
          className="hide-sm-down"
        >
          {units.map(unit => <IonSelectOption key={unit}>{unit}</IonSelectOption>)}
        </IonSelect>

    return (
      <>
        <IonItem
          key="createItemWrapper"
          lines="none"
          style={{ width: "100%" }}
          className={`create-item ${(isFirstItem || highlight) && "highlight"}`}>
          <IonInput
            placeholder={t('Item name')}
            name="name"
            value={name}
            type="text"
            readonly={!!originShoppingItemUid}
            required="true"
            autocapitalize
            autocorrect="on"
            debounce={100}
            style={{ marginRight: "0px", minWidth: "135px" }}
            size={16}
            ref={this.nameInput}
            slot="start"
            onKeyUp={this.onKeyPress}
            onIonInput={event => this.onKeyPress(event)}
            onIonChange={event => this.onChange(event)}
            onIonBlur={event => this.onBlur(event)}
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
            slot="end"
            style={{ marginRight: "0px", minWidth: "63px" }}
            className="hide-sm-down"
            ref={this.quantityInput}
          />
          {unitOfMeasure}
          <IonButton
            slot="end"
            onClick={() => this.concludeEditing()} style={{ 'marginLeft': '10px' }}>
            <IonIcon icon={addOutline} />
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
