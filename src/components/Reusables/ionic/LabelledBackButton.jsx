import React from 'react'
import { useTranslation } from 'react-i18next'
import { IonBackButton } from '@ionic/react'


const LabelledBackButton = ({ defaultHref }) => {
	const { t } = useTranslation()
	return (
		<IonBackButton
			defaultHref={defaultHref}
			text={t('Back')}
			data-test='back'>
		</IonBackButton>
	)
}

export default LabelledBackButton