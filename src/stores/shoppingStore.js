import { decorate, observable, action, computed, toJS } from 'mobx'
import toObject from '../lib/convertArrayToObject'
import sortItems from '../components/Reusables/functions/sortItems'
import { LIFECYCLE_STATUS_ARCHIVED } from '../constants/lists'

// This store holds all information needed to create and manage shopping lists 
// and their items

class ShoppingStore {
	shoppingLists = null;
	currentShoppingList = null;
	currentShoppingListItems = null;
	currentDependentNeedsLists = null;
	currentDependentNeedsListsItems = null;
	initializationDone = false;

	constructor(rootStore) {
		this.rootStore = rootStore
	}

	setInitializationDone(done) {
		this.initializationDone = done
	}

	setShoppingLists = shoppingLists => {
		this.shoppingLists = toObject(shoppingLists)

		const currentShoppingLists = shoppingLists.filter(shoppingList => !!shoppingList.isCurrent)
		this.currentShoppingList = (currentShoppingLists.length > 0 && currentShoppingLists[0]) || null
	};

	setCurrentShoppingListItems = (items) => {
		this.currentShoppingListItems = toObject(items)
	}

	setCurrentDependentNeedsLists = (lists) => {
		this.currentDependentNeedsLists = toObject(lists)
	}

	setDependentNeedsListItems = (listId, items) => {
		this.currentDependentNeedsLists[listId].items = items
	}

	get shoppingListsArray() {
		return Object.keys(this.shoppingLists || {}).map(key => ({
			...this.shoppingLists[key],
			uid: this.shoppingLists[key].uid,
		}))
	}

	get currentShoppingListItemsArray() {
		return Object.keys(this.currentShoppingListItems || {}).map(key => ({
			...this.currentShoppingListItems[key],
			uid: this.currentShoppingListItems[key].uid,
		}))
			.sort((a, b) => sortItems(a, b))
	}

	get currentDependentNeedsListsArray() {
		return Object.keys(this.currentDependentNeedsLists || {})
			.filter(needsList => needsList.lifecycleStatus !== LIFECYCLE_STATUS_ARCHIVED)
			.map(key => ({
				...this.currentDependentNeedsLists[key],
				uid: this.currentDependentNeedsLists[key].uid,
			}))
	}

	get currentDependentNeedsListsItemsArray() {
		if (!this.currentDependentNeedsLists) return []

		let allDependentNeededItems = []

		Object.keys(this.currentDependentNeedsLists || {}).forEach((key) => {
			const neededItems = this.currentDependentNeedsLists[key].items
			if (neededItems && neededItems.length) {
				const needsList = this.currentDependentNeedsLists[key]
				allDependentNeededItems = allDependentNeededItems.concat(neededItems.map(
					neededItem => Object.assign(toJS(neededItem),
						{
							needsListId: toJS(needsList.uid),
							ownerId: toJS(needsList.userId)
						}
					)))
			}
		})
		return allDependentNeededItems
	}
}

decorate(ShoppingStore, {
	shoppingLists: observable,
	currentShoppingList: observable,
	currentShoppingListItems: observable,
	currentDependentNeedsLists: observable,
	currentDependentNeedsListsItems: observable,
	initializationDone: observable,

	setInitializationDone: action,
	setShoppingLists: action,
	setCurrentShoppingListItems: action,
	setCurrentDependentNeedsLists: action,
	setDependentNeedsListItems: action,

	shoppingListsArray: computed,
	currentShoppingListItemsArray: computed,
	currentDependentNeedsListsArray: computed,
	currentDependentNeedsListsItemsArray: computed,
})

export default ShoppingStore

