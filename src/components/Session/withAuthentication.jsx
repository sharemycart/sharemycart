import React from 'react'
import { inject } from 'mobx-react'
import { compose } from 'recompose'

import { withFirebase } from '../Firebase'

const withAuthentication = Component => {
	class WithAuthentication extends React.Component {
		constructor(props) {
			super(props)

			this.props.sessionStore.setAuthUser(
				JSON.parse(localStorage.getItem('authUser')),
			)

			this.listener = null

			// Decorate the wrapped components so that it can react on authentication happening
			this.registerAuthListener = (handler) => {
				this.listener = handler
				return true
			}
		}

		componentDidMount() {
			this.unregisterHandler = this.props.firebase.onAuthUserListener(
				authUser => {
					localStorage.setItem('authUser', JSON.stringify(authUser))
					this.props.sessionStore.setAuthUser(authUser)
					if (this.listener) this.listener(authUser)
				},
				() => {
					localStorage.removeItem('authUser')
					this.props.sessionStore.setAuthUser(null)
					if (this.listener) this.listener(null)
				},
			)

			// for the redirect, setup the hook as well:
			this.props.firebase.auth.getRedirectResult()
				.then((result) => {
					const authUser = result.user
					localStorage.setItem('authUser', JSON.stringify(authUser))
					this.props.sessionStore.setAuthUser(authUser)
					if (this.listener) this.listener(authUser)
				})
			// .catch(function (error) {
			// 	// Handle Errors here.
			// 	var errorCode = error.code;
			// 	var errorMessage = error.message;
			// 	// The email of the user's account used.
			// 	var email = error.email;
			// 	// The firebase.auth.AuthCredential type that was used.
			// 	var credential = error.credential;
			// 	// ...
			// })
		}

		componentWillUnmount() {
			this.unregisterHandler()
		}

		render() {
			return <Component
				{...this.props}
				registerAuthListener={this.registerAuthListener}
			/>
		}
	}

	return compose(
		withFirebase,
		inject('sessionStore'),
	)(WithAuthentication)
}

export default withAuthentication
