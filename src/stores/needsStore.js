import { observable, action, computed, decorate } from 'mobx'
import toObject from '../lib/convertArrayToObject'
import sortItems from '../components/Reusables/functions/sortItems'

// This store holds all information needed to create and manage needs lists 
// and their items

class NeedsStore {
	needsLists = null;
	currentNeedsList = null;
	currentNeedsListItems = null;
	currentOriginShoppingList = null;
	currentOriginShoppingListItems = null;
	initializationDone = false;

	constructor(rootStore) {
		this.rootStore = rootStore
	}

	setInitializationDone(done) {
		this.initializationDone = done
	}

	setNeedsLists = needsLists => {
		this.needsLists = toObject(needsLists)

		const currentNeedsLists = needsLists.filter(needsList => !!needsList.isCurrent)
		this.currentNeedsList = (currentNeedsLists.length > 0 && currentNeedsLists[0]) || null

	};

	setCurrentNeedsListItems = (items) => {
		this.currentNeedsListItems = toObject(items)
	}

	setCurrentOriginShoppingList = shoppingList => this.currentOriginShoppingList = shoppingList;

	setCurrentOriginShoppingListItems = (items) => {
		this.currentOriginShoppingListItems = toObject(items)
	}

	get needsListsArray() {
		return Object.keys(this.needsLists || {}).map(key => ({
			...this.needsLists[key],
			uid: this.needsLists[key].uid,
		}))
	}

	get currentNeedsListItemsArray() {
		return Object.keys(this.currentNeedsListItems || {}).map(key => ({
			...this.currentNeedsListItems[key],
			uid: this.currentNeedsListItems[key].uid,
		}))
			.sort((a, b) => sortItems(a, b))
	}

	get potentiallyNeededItemsArray() {
		// all items from the current origin shopping list are potential needs
		// which are not already moved to the needs list
		const needsByName = {}
		Object.keys(this.currentNeedsListItems || {}).forEach(key => {
			const item = this.currentNeedsListItems[key]
			needsByName[item.name] = item
		})

		return Object.keys(this.currentOriginShoppingListItems || {})
			.map(key => ({
				...this.currentOriginShoppingListItems[key],
				uid: this.currentOriginShoppingListItems[key].uid,
			}))
			.filter(item => !needsByName[item.name])
			.sort((a, b) => sortItems(a, b))
	}
}

decorate(NeedsStore, {
	needsLists: observable,
	currentNeedsList: observable,
	currentNeedsListItems: observable,
	currentOriginShoppingList: observable,
	currentOriginShoppingListItems: observable,
	initializationDone: observable,
	
	setInitializationDone: action,
	setNeedsLists: action,
	setCurrentNeedsListItems: action,
	setCurrentOriginShoppingList: action,
	setCurrentOriginShoppingListItems: action,

	needsListsArray: computed,
	currentNeedsListItemsArray: computed,
	potentiallyNeededItemsArray: computed,
})

export default NeedsStore
