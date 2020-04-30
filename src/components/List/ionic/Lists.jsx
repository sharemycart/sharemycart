import React from 'react'
import { IonItem, IonLabel, IonIcon, IonList, IonButton } from '@ionic/react'
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
							data-test="list"
							onClick={() => {
								props.onSetCurrentList(list)
								props.history.push(props.hrefOnClick)
							}}>
							<IonLabel>
								<ListTitle list={list} /><br />
								{list && list.createdAt && <span style={{ fontSize: '0.7em' }}><Trans>Created on</Trans>&nbsp;{new Date(list.createdAt.seconds * 1000).toLocaleDateString()}</span>}
							</IonLabel>
							<ListLifecycleIcon list={list} slot="start" defaultIcon={documentTextOutline} />
							{list.lifecycleStatus !== LIFECYCLE_STATUS_ARCHIVED &&
								<IonButton
									slot="end"
									color="danger"
									data-test="btn-delete-list"
									size="large"
									fill="clear"
									onClick={() => {
										props.onRemoveList(list)
									}} >
									<IonIcon icon={trashBinOutline} />
								</IonButton>
							}
						</IonItem>
					))
			}
		</IonList>
	)
}

export default withRouter(Lists)