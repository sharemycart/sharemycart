import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// MOBX
import { inject, observer } from 'mobx-react';
import BasicPage from '../basicpage/BasicPage';
import { IonList } from '@ionic/react';
import Item from '../shoppings/Item';

const shoppingListItems = [{
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

class Needs extends Component {
	constructor (props) {
		super(props);
		this.state = { shoppingListItems, neededItems: [] };
	}
	render () {
		return (
			<BasicPage
				title="My Needs"
				store={this.props.store}
				renderContent={history => {
					return (
						<>
							<IonList>
								{this.state.shoppingListItems.map(item => (<Item
									key={item.id}
									item={item}
									ownList={false}
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

export default withRouter(inject('store')(observer(Needs)));
