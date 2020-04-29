import React from 'react'

import { compose } from 'recompose'
import { inject, observer } from 'mobx-react'

import NeedsModel from '../../../models/Needs'

import { IonHeader, IonToolbar, IonButtons, IonContent, IonFooter, IonPage, IonItem, IonLabel, IonToggle } from '@ionic/react'

import { NEEDS } from '../../../constants/routes'
import Lists from '../../List/ionic/Lists'
import { withEmailVerification } from '../../Session'
import { withFirebase } from '../../Firebase'
import LabelledBackButton from '../../Reusables/ionic/LabelledBackButton'
import { Trans } from 'react-i18next'

class NeedsListsPage extends NeedsModel {

	constructor(props) {
		super(props)

		this.state = { ...this.state, includeArchived: false }
	}

	render() {
		return (
			<IonPage>
				<IonHeader>
					<IonToolbar>
						<IonButtons slot="start">
							<LabelledBackButton defaultHref={NEEDS} />
						</IonButtons>
						<IonItem lines="none" slot="end">
							<IonLabel><Trans>Include archived</Trans></IonLabel>
							<IonToggle checked={this.state.includeArchived} onIonChange={e => this.setState({ includeArchived: e.detail.checked })} />
						</IonItem>
					</IonToolbar>
				</IonHeader>
				<IonContent>

					{this.props.sessionStore.dbAuthenticated
						&& <Lists
							lists={this.props.needsStore.needsListsArray}
							onSetCurrentList={(list) => this.onSetCurrentNeedsList(list.uid)}
							onRemoveList={(list) => this.onArchiveNeedsList(list)}
							includeArchived={this.state.includeArchived}
							hrefOnClick={NEEDS}
						/>}

				</IonContent>
				<IonFooter>

				</IonFooter>
			</IonPage>)
	}
}

export default compose(
	withFirebase,
	withEmailVerification,
	inject('needsStore', 'userStore', 'sessionStore'),
	observer,
)(NeedsListsPage)

