import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
	IonButton,
	IonItem,
	IonList,
	IonLabel,
	IonIcon
} from '@ionic/react';
import { add, cart } from 'ionicons/icons';
import Item from './Item';
import EditItem from './EditItem';

// MOBX
import { inject, observer } from 'mobx-react';
import BasicPage from '../basicpage/BasicPage';
import ShareListFab from './ShareListFab';

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

	constructor(props) {
		super(props);
		this._hasUnmounted = false;
		this.state = {
			list: null,
			items: [],
			inNewMode: false,
			newItem: {}
		};
	}

	async componentDidMount() {
		if (this._hasUnmounted) {
			return;
		}
		const list = await this.props.store.getMyCurrentShoppingList()
		const items = await this.props.store.getMyCurrentShoppingListItems()
		this.setState({ list, items });
	}

	componentWillUnmount() {
		this._hasUnmounted = true;
	}

	onChangeNewItem (newItem) {
		this.setState({ newItem });
	}

	onCreateComplete() {
		let newItem = this.state.newItem;
		if (!newItem.name || !newItem.quantity || !newItem.unit) {
			return;
		}
		this.props.store.addItem({listId: this.state.list.id, item: newItem})
			.then(() => {
				console.log('item added successfully');
			});
		this.setState({ items: this.state.items.concat(newItem), newItem: {}, inNewMode: false });
	}

	onUpdateItem(item) {
		this.setState(state => ({
			items: state.items.map(i => i.id === item.id ? item : i)
		}))
		this.props.store.editItem({listId: this.state.list.id, item})
			.then(() => {
				console.log('item updated successfully')
			});
	}

	onDeleteItem(item) {
		this.setState(state => ({
			items: state.items.filter(i => i.id !== item.id)
		}))
		this.props.store.deleteItem({listId: this.state.list.id, item})
			.then(() => {
				console.log('item deleted successfully')
			})
	}

	render() {
		const newItem = this.state.inNewMode
			? <EditItem item={this.state.newItem}
									onChange={item => this.onChangeNewItem(item)}
									onClose={() => this.onCreateComplete()}
									mode="shopping"
			/>
			: <IonItem style={{ color: 'grey' }}>
				<IonIcon icon={add} />
				<IonLabel onClick={() => this.setState({ inNewMode: true })}>Click here to add item</IonLabel>
			</IonItem>;

		const goShoppingButton = <IonButton href="/goshopping">Go <IonIcon icon={cart} /></IonButton>;

		return (
			<BasicPage
				title="My Shoppings"
				store={this.props.store}
				titleButtons={goShoppingButton}
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
							<ShareListFab />
						</>
					);
				}}
			>
			</BasicPage>
		);
	}
}

export default withRouter(inject('store')(observer(Shoppings)));
