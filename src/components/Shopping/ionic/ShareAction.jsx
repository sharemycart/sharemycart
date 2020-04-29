import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { withTranslation } from 'react-i18next'

import {
	IonToast,
	IonFabButton,
	IonIcon
} from '@ionic/react'
import { shareSocialOutline } from 'ionicons/icons'
import { compose } from 'recompose'
import { inject } from 'mobx-react'

class ShareListFab extends Component {
	constructor(props) {
		super(props)
		this._hasUnmounted = false
		this.state = {
			message: '',
			showToast: false
		}
	}

	generateShareLink = () => {
		let shoppingListId = this.props.shoppingStore.currentShoppingList.uid
		return `${window.location.origin}/share/${shoppingListId}`
	};

	async componentDidMount() {
		if (this._hasUnmounted) {
			return
		}
	}

	componentWillUnmount() {
		this._hasUnmounted = true
	}

	render() {
		const { t } = this.props
		const sharingMessageTextTranslation = t('Sharing_message')
		const sharingMessageText = sharingMessageTextTranslation !== 'Sharing_message'
			? sharingMessageTextTranslation + ' '
			: ''
		return (
			<>
				<CopyToClipboard text={sharingMessageText + this.generateShareLink()}>
					<IonFabButton title={t('Share')} color="primary" onClick={() => {
						this.setState({
							showToast: true,
							message: t('Sharing_link_copied')
						})
					}}>
						<IonIcon icon={shareSocialOutline} />
					</IonFabButton>
				</CopyToClipboard>
				<IonToast
					isOpen={this.state.showToast}
					onDidDismiss={() => this.setState(() => ({ showToast: false }))}
					message={this.state.message}
					duration={5000}
				/>
			</>
		)
	}
}

export default compose(
	withTranslation(),
	inject('shoppingStore'),
	withRouter
)(ShareListFab)