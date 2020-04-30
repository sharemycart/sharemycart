import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

import LoadingAnimation from '../../Reusables/ionic/LoadingAnimation'
import { withRouter } from 'react-router'
import { ITEM_TYPE_IN_SHOPPING } from '../../../constants/items'
import ShoppingList from '../../Shopping/ionic/ShoppingList'

class GoShopping extends Component {

	constructor(props) {
		super(props)
		this.statusTransitionTriggered = false
	}

	componentDidUpdate() {
		if (!this.statusTransitionTriggered && this.props.shoppingStore.currentShoppingList) {
			this.props.model.onGoShopping(this.props.shoppingStore.currentShoppingList)
			this.statusTransitionTriggered = true
		}
	}

	render() {
		const { shoppingStore, sessionStore } = this.props
		const {
			// shoppingListsArray: shoppingLists,
			currentShoppingList,
			currentShoppingListItemsArray: currentShoppingListItems,
			currentDependentNeedsListsArray: currentDependentNeedsLists,
			currentDependentNeedsListsItemsArray: currentDependentNeedsListsItems,
			initializationDone,
		} = shoppingStore

		if (!initializationDone) return <LoadingAnimation loading={initializationDone} />

		return (
			currentShoppingList &&
			<>
				<ShoppingList
					authUser={sessionStore.authUser}
					list={currentShoppingList}
					items={currentShoppingListItems}
					mode={ITEM_TYPE_IN_SHOPPING}
					dependentNeedLists={currentDependentNeedsLists}
					bringAlongItems={currentDependentNeedsListsItems}
					onCreateItem={this.props.model.onCreateItemForCurrentShoppingList}
					onEditItem={this.props.model.onEditShoppingItem}
					onShopItem={this.props.model.onShopShoppingItem}
					onDeleteItem={this.props.model.onRemoveShoppingItem}
					onReorderItems={this.props.model.onReorderItems}
				/>
			</>
		)
	}
}

export default compose(
	withRouter,
	inject('shoppingStore', 'sessionStore'),
	observer,
)(GoShopping)
