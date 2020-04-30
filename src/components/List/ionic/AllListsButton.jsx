import React from 'react'

import { IonButton, IonIcon } from '@ionic/react'
import { listOutline } from 'ionicons/icons'

import { Trans } from 'react-i18next'

const AllListsButton = ({ href, label }) => (
	<IonButton fill="clear" data-test="btn-all-lists"
		href={href}>
		<span className="hide-sm-down"><Trans>{label}</Trans></span>
		<IonIcon slot="start" icon={listOutline} />
	</IonButton>
)

export default AllListsButton