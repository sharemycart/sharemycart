import React, { Component } from 'react'
import Item from '../../Item/ionic/Item'
import { IonList, IonReorderGroup, IonToggle, IonLabel, IonItem } from '@ionic/react'
import { LIFECYCLE_STATUS_OPEN } from '../../../constants/lists'
import { Trans } from 'react-i18next'
import { compose } from 'recompose'
import { inject, observer } from 'mobx-react'
import sortItems from '../../Reusables/functions/sortItems'

class ShoppingList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			editName: this.props.list.name,
		}

		if (this.props.addSaveEditHandler) {
			this.props.addSaveEditHandler(this.saveEdit.bind(this))
		}
	}

	onChangeEditName = event => {
		this.setState({ editName: event.target.value })
	};

	onSaveEditName = () => {
		this.props.onEditList(this.props.list, this.state.editName)
	};

	doReorder(event) {
		event.detail.complete()

		const { children } = event.srcElement
		let order = {}
		event.detail.complete()
		let position = 0

		// eslint-disable-next-line
		for (const k in children) {
			position++
			if (children.hasOwnProperty(k)) {
				if (children[k].id) {
					order[children[k].id] = position
				}
			}
		}

		this.setState({ order })
	}

	saveEdit() {
		this.onSaveEditName()
		if (this.state.order) {
			this.props.onReorderItems(this.props.list.uid, this.props.items, this.state.order)

			// also re-order all items to bring along
			const {
				currentDependentNeedsListsArray: currentDependentNeedsLists,
				currentDependentNeedsListsItemsArray: currentDependentNeedsListsItems,
			} = this.props.shoppingStore

			currentDependentNeedsLists.forEach(needsList => {
				this.props.onReorderItems(
					needsList.uid,
					currentDependentNeedsListsItems.filter(item => item.parentId === needsList.uid),
					this.state.order)
			})

		}
	}

	render() {
		const {
			items,
			list,
			onEditList,
			onEditItem,
			onDeleteItem,
			onShopItem,
			editMode,
			userStore,
		} = this.props

		// we need to visualize the items to bring along differently
		// whether they are related to a shopping list item or not
		// the following lines determine the relationship between shopping items
		// and the ones from dependent needs lists
		const bringAlongItemsByShoppingItem = {} // Map with key shopping item id
		const otherUsersOwnNeededItems = []; // additional items without any relation

		(this.props.bringAlongItems || []).forEach((neededItem) => {
			if (neededItem.quantity <= 0) return false
			const originItem =
				items.find(item => item.uid === neededItem.originShoppingItemId) ||
				items.find(item => item.name === neededItem.name)

			if (originItem) {
				bringAlongItemsByShoppingItem[originItem.uid] &&
					bringAlongItemsByShoppingItem[originItem.uid].length
					? bringAlongItemsByShoppingItem[originItem.uid].push(neededItem)
					: bringAlongItemsByShoppingItem[originItem.uid] = [neededItem]
			} else {
				const owner = userStore.users[neededItem.ownerId]
				otherUsersOwnNeededItems.push({
					...neededItem,
					owner,
					ownedByOtherUser: true
				})
			}
		})

		return (
			<>
				<IonList>
					{/* // The following component is actually a hack. I expected the IonReorderGroup to 
        // toggle "disabled" based on the edit mode.
        // However, whit does not work as expected, as when leaving back to non-Edit-mode, 
        // the oder is destroyed until loaded from the database for the next time */}

					{
						!editMode
						&& items.concat(otherUsersOwnNeededItems || [])
							.sort((a, b) => sortItems(a, b))
							.map((item, key) => {
								const relatedBringAlongItems = bringAlongItemsByShoppingItem[item.uid]
								return (
									<Item
										key={item.id || key}
										item={item}
										owner={item.owner}
										bringAlongItems={relatedBringAlongItems}
										ownList={!item.ownedByOtherUser}
										onEditingConcluded={onEditItem}
										onDeleteItem={onDeleteItem}
										onShopItem={onShopItem}
										mode={this.props.mode}
										readOnly={this.props.list.lifecycleStatus !== LIFECYCLE_STATUS_OPEN || item.ownedByOtherUser}
									/>)
							})
					}
					{/* { 
            !editMode && otherUsersOwnNeededItems && !!otherUsersOwnNeededItems.length
            && <IonListHeader lines="inset"><h3><Trans>Needed items of friends</Trans></h3></IonListHeader>
          }
          {
            !editMode && otherUsersOwnNeededItems.map((item, key) => {
            return (
              <Item
                key={item.id || key}
                item={item}
                ownList={false}
                onShopItem={onShopItem}
                mode={this.props.mode}
                readOnly={true}
              />)
          })
          } */}
					{
						editMode &&
						<>
							<IonItem lines="none">
								<IonLabel><Trans>Allow friends to add own needs</Trans></IonLabel>
								<IonToggle
									name="allowCreateOwnNeeds"
									checked={list.allowCreateOwnNeeds}
									onIonChange={() => {
										onEditList(Object.assign(list, { allowCreateOwnNeeds: !list.allowCreateOwnNeeds }))
									}}
								/>
							</IonItem>
							<IonReorderGroup disabled={false} onIonItemReorder={this.doReorder.bind(this)}>
								{items.concat(otherUsersOwnNeededItems || [])
									.sort((a, b) => sortItems(a, b))
									.map((item, key) => (
										<Item
											key={item.id || key}
											item={item}
											ownList={true}
											onEditingConcluded={onEditItem}
											onDeleteItem={onDeleteItem}
											onShopItem={onShopItem}
											mode={this.props.mode}
											readOnly={this.props.list.lifecycleStatus !== LIFECYCLE_STATUS_OPEN}
											listEditMode={editMode}
										/>))}
							</IonReorderGroup>
						</>
					}
				</IonList>
			</>
		)
	}
}

export default compose(
	inject('shoppingStore', 'userStore'),
	observer,
)(ShoppingList)
