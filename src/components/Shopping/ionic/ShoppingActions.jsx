import React from 'react'
import { IonFabButton, IonFab, IonIcon, IonFabList } from '@ionic/react'
import { ellipsisVerticalOutline } from 'ionicons/icons'

import ShareFabButton from './ShareAction'
import GoShoppingAction from './GoShoppingAction'

import './shoppingActions.scss'
import { compose } from 'recompose'
import { inject } from 'mobx-react'
import { LIFECYCLE_STATUS_ARCHIVED } from '../../../constants/lists'
import CreateListAction from '../../List/ionic/CreateListAction'
import { useTranslation } from 'react-i18next'

const ShoppingActions = ({ model, shoppingStore, hasItems }) => {
	const { t } = useTranslation()
	const { initializationDone, currentShoppingList } = shoppingStore

	const CreateShoppingListAction = () => <CreateListAction
		title={t('Create Shopping List')}
		onClick={() => model.onCreateShoppingList(`${t('Shopping list')}`)}
	/>


	if (!initializationDone) return null
	if (currentShoppingList && currentShoppingList.lifecycleStatus !== LIFECYCLE_STATUS_ARCHIVED && !hasItems) return null

	return (
		<IonFab vertical="bottom" horizontal="end" className="shopping-actions">
			{currentShoppingList && currentShoppingList.lifecycleStatus !== LIFECYCLE_STATUS_ARCHIVED
				? <>
					<IonFabButton>
						<IonIcon icon={ellipsisVerticalOutline} />
					</IonFabButton>
					<IonFabList side="top">
						<ShareFabButton />
						<GoShoppingAction model={model} />
						<CreateShoppingListAction />
					</IonFabList>
				</>
				: <CreateShoppingListAction />
			}
		</IonFab>
	)
}

export default compose(
	inject('shoppingStore')
)(ShoppingActions)