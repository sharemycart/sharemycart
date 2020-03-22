import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
	IonContent,
	IonList,
	IonSearchbar,
	IonItem
} from '@ionic/react';
import Item from './Item';
import { cart } from 'ionicons/icons';

// MOBX
import { inject, observer } from 'mobx-react';
import BasicPage from '../basicpage/BasicPage';

const ENTER_KEY = 13;

// const items = [{
// 	id: 1,
// 	name: 'Tomatoes',
// 	unit: 'kg',
// 	quantity: 5
// }, {
// 	id: 2,
// 	name: 'Avocado',
// 	unit: 'pc',
// 	quantity: 1
// }, {
// 	id: 3,
// 	name: 'Flour',
// 	unit: 'g',
// 	quantity: 500
// }];

class Shoppings extends Component {

	constructor (props) {
		super(props);
		this._hasUnmounted = false;
		this.state = { searchText: '', items: [] };
	}

	componentDidMount () {
		if (this._hasUnmounted) {
			return;
		}
		this.props.store.getMyItems()
			.then(items => {
				if (!this._hasUnmounted) {
					this.setState({ items: items });
				}
			})
			.catch(error => {
				console.error('error found', error);
			})
		;
	}

	componentWillUnmount () {
		this._hasUnmounted = true;
	}

	createItemFromText (text) {
		const parts = text.split(/^(\d+)\s*(g|kg|pc|l|ml)\s*(.*)$/i);
		parts.shift();
		const quantity = parts.shift();
		const unit = parts.shift();
		const name = parts.join(' ');
		return { quantity, unit, name };
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

	onUpdateItem (item, text) {
		const modified = this.createItemFromText(text);
		this.setState(state => ({
			items: state.items.map(i => i.id === item.id ? modified : i)
		}));
	}

	onDeleteItem (item) {
		this.setState(state => ({
			items: state.items.filter(i => i.id !== item.id)
		}));
	}

	render () {
		return (
			<BasicPage
				title="My Shoppings"
				store={this.props.store}
				renderContent={history => {
					let view = '';
					if (this.state.items.length > 0) {
						view = this.state.items.map(item => (<Item
							key={item.id}
							item={item}
							onUpdateItem={text => this.onUpdateItem(item, text)}
							onDeleteItem={() => this.onDeleteItem(item)}
						/>));
					} else{
						view = <>
							<IonItem>No items in your list yet</IonItem>
						</>;

					}

					return (
						<>
							<IonSearchbar
								searchIcon={cart}
								value={this.state.searchText}
								onKeyPress={this.onAddItem}
								placeholder="Type to add new products"></IonSearchbar>
							<IonList>
								{view}
							</IonList>
						</>
					);
				}}
			>
			</BasicPage>
		);
	}
}

export default withRouter(inject('store')(observer(Shoppings)));
