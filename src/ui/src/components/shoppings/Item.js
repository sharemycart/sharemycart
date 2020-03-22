import React, { Component } from "react";
import { IonItem, IonLabel, IonButton, IonIcon, IonInput } from "@ionic/react";
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import { trash, add } from 'ionicons/icons';

const ENTER_KEY = 13;

class Item extends Component {
	constructor (props) {
		super(props);
		this.state = { inEdit: false };
	}

  onEditItem() {
    this.setState({inEdit: true})
  }

  onKeyPress(event) {
    if (event.which !== ENTER_KEY) {
			return;
		}
    this.props.onUpdateItem(event.target.value)
    this.setState({inEdit: false})
  }

  render() {
    const itemDisplay = this.state.inEdit ?
      (<IonInput
        value={`${this.props.item.quantity} ${this.props.item.unit} ${this.props.item.name}`}
        onKeyPress={event => this.onKeyPress(event)}
        style={{border: "1px solid grey"}}
      />)
      :
      <IonLabel onClick={() => this.onEditItem()}>{this.props.item.quantity} {this.props.item.unit} {this.props.item.name}</IonLabel>

    return <IonItem>
      {itemDisplay}
      <IonButton fill="add" size="large" slot="end" color="primary">
        <IonIcon icon={add} />
      </IonButton>
      <IonButton className="button-end" fill="clear" size="large" slot="end" color="danger" onClick={this.props.onDeleteItem}>
        <IonIcon icon={trash} />
      </IonButton>
    </IonItem>
  }
}

export default withRouter(inject('store')(observer(Item)))
