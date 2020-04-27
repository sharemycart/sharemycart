import React from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFooter } from '@ionic/react'
import { inject, observer } from 'mobx-react'
import { withEmailVerification, withAuthorization } from '../../Session'
import { compose } from 'recompose'
import Profile from './Profile'
import SignOutButton from '../../SignOut/ionic'

import { PasswordChangeButton } from '../../PasswordChange/ionic'

import {Trans} from 'react-i18next'

import './page.css'

const AccountPage = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle><Trans>Account</Trans></IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large"><Trans>Account</Trans></IonTitle>
					</IonToolbar>
				</IonHeader>
				<Profile />
				<IonFooter>
					<IonToolbar>
						<PasswordChangeButton />
						<SignOutButton />
					</IonToolbar>
				</IonFooter>
			</IonContent>
		</IonPage>
	)
}

const condition = authUser => !!authUser

export default compose(
	inject('sessionStore'),
	observer,
	withEmailVerification,
	withAuthorization(condition),
)(AccountPage)