import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { IonList, IonLabel, IonItem, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Item';
import EditItem from './EditItem';

// MOBX
import { inject, observer } from 'mobx-react';
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
		this.state = { items, inNewMode: false, newItem: {} };
	}

	onCreateItem(newItem) {
		this.setState({newItem})
	}

	onCreateComplete() {
		this.setState({items: this.state.items.concat(this.state.newItem), newItem: {}, inNewMode: false})
	}

	onUpdateItem (item) {
		this.setState(state => ({
			items: state.items.map(i => i.id === item.id ? item : i)
		}));
	}

	onDeleteItem (item) {
		this.setState(state => ({
			items: state.items.filter(i => i.id !== item.id)
		}));
	}

	render () {
		const newItem = this.state.inNewMode
	 		? <EditItem item={this.state.newItem} onChange={item => this.onCreateItem(item)} onClose={() => this.onCreateComplete()} />
		 	: <IonItem style={{color: 'grey'}}>
				 	<IonIcon icon={add} />
				 	<IonLabel onClick={() => this.setState({inNewMode: true})}>Click here to add item</IonLabel>
				</IonItem>

		return (
			<BasicPage
				title="My Shoppings"
				store={this.props.store}
				renderContent={history => {
					return (
						<>
							{newItem}
							<IonList>
								{this.state.items.map(item => (<Item
									key={item.id}
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
