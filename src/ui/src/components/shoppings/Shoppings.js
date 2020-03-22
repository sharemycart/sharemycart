import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
	IonContent,
	IonIcon,
	IonBadge,
	IonLabel,
	IonButton,
	IonItem,
	IonList,
	IonSearchbar,
} from '@ionic/react';
import { trash, cart, add } from 'ionicons/icons';

// MOBX
import { inject, observer } from 'mobx-react';
import TabContainer from '../tabs/TabContainer';
import BasicPage from '../basicpage/BasicPage';

const ENTER_KEY = 13;
// @todo: load this from the server
const items = [{
	id: 1,
	name: 'Tomatoes',
	unit: 'kg',
	quantity: 5
}, {
	id: 2,
	name: 'Avocado',
	unit: 'pc',
	quantity: 1
}, {
	id: 3,
	name: 'Flour',
	unit: 'g',
	quantity: 500
}];

class Shoppings extends Component {

	constructor (props) {
		super(props);
		this.state = { searchText: '', items: items };
	}

	createItemFromText(text) {
		const parts = text.split(/^(\d+)\s*(g|kg|pc|l|ml)\s*(.*)$/i)
		parts.shift()
		const quantity = parts.shift()
		const unit = parts.shift()
		const name = parts.join(' ')
		return {quantity, unit, name}
	}

	onAddItem = (evt) => {
		if (evt.which !== ENTER_KEY) {
			return;
		}
		const item = this.createItemFromText(evt.target.value);
		const newItems = this.state.items;
		newItems.push(item);
		this.setState({
			items: newItems
		});
		// @todo: connect here
		// this.props.store.addItem({ text: text })
		// 	.then(() => {
		// 		// clear the search input
		// 		this.setState({ searchText: '' });
		// 		// @todo: reload the store
		// 	}).catch(err => {
		// 	console.error(err);
		// 	// @todo: handle exception here with a toast
		// });
	};

	render () {
		return (
			<BasicPage
				title="My Shoppings"
				store={this.props.store}
				renderContent={history => {
					return (
						<>
							<IonContent>
								<TabContainer history={this.props.history}/>
								<IonSearchbar
									searchIcon={cart}
									value={this.state.searchText}
									onKeyPress={this.onAddItem}
									placeholder="Type to add new products"></IonSearchbar>
								<IonList>
									{this.state.items.map(item => {
										// @todo: add the handlers for the buttons plus and remove
										return (<IonItem key={item.id}>
											<IonLabel>{item.name}</IonLabel>
											<IonBadge slot="end" color="dark">{item.quantity}{item.unit}</IonBadge>
											<IonButton fill="add" size="large" slot="end" color="primary"><IonIcon
												icon={add}/></IonButton>
											<IonButton className="button-end" fill="clear" size="large" slot="end" color="danger"><IonIcon
												icon={trash}/></IonButton>
										</IonItem>);
									})}
								</IonList>
							</IonContent>
						</>
					);
				}}
			>
			</BasicPage>
		);
	}
}

export default withRouter(inject('store')(observer(Shoppings)));
