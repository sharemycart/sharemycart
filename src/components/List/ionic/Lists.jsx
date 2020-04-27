import React from 'react'
import { IonItem, IonLabel, IonIcon, IonList } from '@ionic/react'
import { trashBinOutline, documentTextOutline } from 'ionicons/icons'
import { withRouter } from 'react-router'
import ListTitle from './ListTitle'
import ListLifecycleIcon from './ListLifecycleIcon'
import { LIFECYCLE_STATUS_ARCHIVED } from '../../../constants/lists'
import { Trans } from 'react-i18next'

const Lists = (props) => {
	return (
		<IonList>
			{
				props.lists && props.lists
					.filter(l => props.includeArchived ? true : l.lifecycleStatus !== LIFECYCLE_STATUS_ARCHIVED)
					.map(list => (
						<IonItem
							key={list.uid}
							onClick={() => {
								props.onSetCurrentList(list)
								props.history.push(props.hrefOnClick)
							}}>
							<IonLabel>
								<ListTitle list={list} /><br />
								{list && <span style={{ fontSize: '0.7em' }}><Trans>Created on</Trans>&nbsp;{new Date(list.createdAt.seconds * 1000).toLocaleDateString()}</span>}
							</IonLabel>
							<ListLifecycleIcon list={list} slot="start" defaultIcon={documentTextOutline} />
							{list.lifecycleStatus !== LIFECYCLE_STATUS_ARCHIVED &&
								<IonIcon icon={trashBinOutline} slot="end" color="danger" onClick={() => {
									props.onRemoveList(list)
								}} />}
						</IonItem>
					))
			}
		</IonList>
	)
}

export default withRouter(Lists)