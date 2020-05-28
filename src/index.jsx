import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import PwaIosInstallInvitation, { IconShareIos } from 'pwa-ios-invitation'

import * as serviceWorker from './serviceWorker'

import store from './stores'
import App from './components/App/ionic'
import Firebase, { FirebaseContext } from './components/Firebase'
import { Trans } from 'react-i18next'

import './i18n'


ReactDOM.render(
	<Fragment>
		<Provider {...store}>
			<FirebaseContext.Provider value={new Firebase()}>
				<App />
			</FirebaseContext.Provider>
		</Provider>

		<PwaIosInstallInvitation
			showPwaInvitation={true}
			iosInvitationTimeout={10000}
			iosInvitationOnlySafari={true}
			iosInvitationContent={
				(iosDevice) =>
					<Fragment>
						<Trans>pwa_install_1</Trans> {iosDevice}: <br /><Trans>pwa_install_2</Trans> <IconShareIos /> <Trans>pwa_install_3</Trans>
					</Fragment>
			}
		/>
	</Fragment>,
	document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
