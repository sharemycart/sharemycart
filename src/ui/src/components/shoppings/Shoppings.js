import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
	IonButton,
	IonList,
	IonIcon
} from '@ionic/react';
import { cart } from 'ionicons/icons';
import Item from './Item';
import EditItem from './EditItem';

// MOBX
import { inject, observer } from 'mobx-react';
import BasicPage from '../basicpage/BasicPage';
import ShareListFab from './ShareListFab';

class Shoppings extends Component {

	constructor(props) {
		super(props);
		this._hasUnmounted = false;
		this.state = { list: null, items: [], newItem: {} };
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
		this.setState({ items: this.state.items.concat(newItem), newItem: {} });
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

	render () {
		const goShoppingButton = <IonButton href="/goshopping">Go <IonIcon icon={cart}/></IonButton>;

		return (
			<BasicPage
				title="My Shoppings"
				store={this.props.store}
				titleButtons={goShoppingButton}
				renderContent={history => {
					return (
						<>
							<EditItem item={this.state.newItem}
									onChange={item => this.onChangeNewItem(item)}
									onClose={() => this.onCreateComplete()}
									mode="shopping"
							/>
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
