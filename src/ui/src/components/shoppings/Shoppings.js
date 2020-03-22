import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
	IonContent,
	IonSearchbar,
	IonItem,
	IonList,
	IonLabel,
	IonIcon
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Item';
import EditItem from './EditItem';

// MOBX
import { inject, observer } from 'mobx-react';
import BasicPage from '../basicpage/BasicPage';
import { v4 as uuidv4 } from 'uuid';

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
		this.state = { items: [], inNewMode: false, newItem: {} };
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

	onCreateItem (newItem) {
		this.setState({ newItem });
	}

	onCreateComplete () {
		let newItem = this.state.newItem;
		if (!newItem.name) {
			return;
		}
		if (!newItem.id) {
			newItem.id = uuidv4();
		}
		this.props.store.addItem(newItem)
			.then(() => {
				console.log('item added successfully');
			});
		this.setState({ items: this.state.items.concat(newItem), newItem: {}, inNewMode: false });
	}

	onUpdateItem (item) {
		this.setState(state => ({
			items: state.items.map(i => i.id === item.id ? item : i)
		}));
		this.props.store.editItem(item.id, item)
			.then(() => {
				console.log('item updated successfully');
			});
	}

	onDeleteItem (item) {
		this.setState(state => ({
			items: state.items.filter(i => i.id !== item.id)
		}));
	}

	render () {
		const newItem = this.state.inNewMode
			? <EditItem item={this.state.newItem} 
						onChange={item => this.onCreateItem(item)}
						onClose={() => this.onCreateComplete()}
						mode="shopping"
						/>
			: <IonItem style={{ color: 'grey' }}>
				<IonIcon icon={add}/>
				<IonLabel onClick={() => this.setState({ inNewMode: true })}>Click here to add item</IonLabel>
			</IonItem>;

		return (
			<BasicPage
				title="My Shoppings"
				store={this.props.store}
				renderContent={history => {
					return (
						<>
							{newItem}
							<IonList>
								{this.state.items.map((item, key) => (<Item
									key={item.id || key}
									item={item}
									ownList={true}
									onUpdateItem={item => this.onUpdateItem(item)}
									onDeleteItem={() => this.onDeleteItem(item)}
									mode={'shopping'}
								/>))}
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
