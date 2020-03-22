import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// MOBX
import { inject, observer } from 'mobx-react';
import BasicPage from '../basicpage/BasicPage';
import { IonList } from '@ionic/react';
import Item from '../shoppings/Item';
import { v4 as uuid } from 'uuid';

const potentiallyNeededItems = [{
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
	constructor(props) {
		super(props);
		this.state = { potentiallyNeededItems, neededItems: [] };
	}

	onCreateNeed(potentialNeed) {
		// create a new needed item and remove the now needed item from the potential needs
		this.setState({
			neededItems: this.state.neededItems.concat(Object.assign(potentialNeed, {quantity: null, id: uuid()})),
			potentiallyNeededItems: this.state.potentiallyNeededItems.filter(item=>item.id !== potentialNeed.id )
		})

	}

	onUpdateItem (item) {
		this.setState(state => ({
			neededItems: state.neededItems.map(i => i.id === item.id ? item : i)
		}));
	}

	onDeleteItem (need) {
		this.setState({
			neededItems: this.state.neededItems.filter(item=>item.id !== need.id ),
			potentiallyNeededItems: this.state.potentiallyNeededItems.concat(need)
		})
	}

	render() {
		return (
			<BasicPage
				title="Needs"
				store={this.props.store}
				renderContent={history => {
					return (
						<>
							<IonList>
								{this.state.neededItems.map(item => (<Item
									key={item.id}
									item={item}
									ownList={true}
									onUpdateItem={item => this.onUpdateItem(item)}
									onDeleteItem={() => this.onDeleteItem(item)}
									mode={'need'}
									onCreateNeed={() => { }}
								/>))}
							</IonList>

							<IonList>
								{this.state.potentiallyNeededItems.map(item => (<Item
									key={item.id}
									item={item}
									ownList={false}
									onUpdateItem={item => this.onUpdateItem(item)}
									onDeleteItem={() => this.onDeleteItem(item)}
									onCreateNeed={() => this.onCreateNeed(item)}
									mode={'potentialNeed'}
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
