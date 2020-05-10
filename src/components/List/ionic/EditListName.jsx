import React from 'react'
import { IonItem, IonInput, IonLabel } from '@ionic/react'

import { useTranslation } from 'react-i18next'

const EditListName = (props) => {

	const { name, onChange } = props
	const { t } = useTranslation()

	return (
		<>
			<IonItem
				key="EditListNameWrapper"
				style={{ width: '100%' }}
				data-test="edit-list-name">
				<IonLabel slot="start">
					{`${t('Name of shopping list')}:`}
				</IonLabel>
				<IonInput
					placeholder={t('Shopping list')}
					name="name"
					value={name}
					type="text"
					autocapitalize
					autocorrect="on"
					debounce={100}
					data-test="input-list-name"
					onIonChange={event => onChange(event)}
					onIonBlur={event => onChange(event)}
				/>
			</IonItem>
		</>
	)
}

export default EditListName