import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// MOBX
import { inject, observer } from 'mobx-react';
import BasicPage from '../basicpage/BasicPage';
import { IonList } from '@ionic/react';
import Item from '../shoppings/Item';
import { v4 as uuid } from 'uuid';

// const potentiallyNeededItems = [{
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

class Needs extends Component {
	constructor(props) {
		super(props);
		this._hasUnmounted = false;
		this.state = { potentiallyNeededItems: [], sharedLists: [], neededItems: [] };
	}

	async componentDidMount() {
		if (this._hasUnmounted) {
			return;
		}
		try {
			const sharedListsSnapshot = await this.props.store.getNeedListsForSharedShoppingLists()
			const sharedLists = []
			let potentiallyNeededItems = []

			sharedListsSnapshot.forEach(doc => sharedLists.push(doc.data()))
			if (sharedLists && sharedLists.length) {
				potentiallyNeededItems = await this.props.store.getItemsOfList(sharedLists[0].originUid, sharedLists[0].originListId)
			}
			if (!this._hasUnmounted) {
				this.setState({
					sharedLists: sharedLists || [],
					potentiallyNeededItems
				});
			}
		} catch (error) {
			console.error('error found', error);
		}
	}

	onCreateNeed(potentialNeeds) {
		// create a new needed item and remove the now needed item from the potential needs
		this.setState({
			neededItems: this.state.neededItems.concat(Object.assign(potentialNeeds, { quantity: null, id: uuid() })),
			potentiallyNeededItems: this.state.potentiallyNeededItems.filter(item => item.id !== potentialNeeds.id)
		})

	}

	onUpdateItem(item) {
		this.setState(state => ({
			neededItems: state.neededItems.map(i => i.id === item.id ? item : i)
		}));
	}

	onDeleteItem(need) {
		this.setState({
			neededItems: this.state.neededItems.filter(item => item.id !== need.id),
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
									mode={'potentialNeeds'}
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
