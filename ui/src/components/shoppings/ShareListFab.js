import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { observer, inject } from 'mobx-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
	IonFab,
	IonItem,
	IonLabel,
	IonPopover,
	IonButton,
	IonToast,
	IonFabButton,
	IonIcon,
	IonListHeader,
	IonItemSliding
} from '@ionic/react';
import { share, exit, copy } from 'ionicons/icons';

class ShareListFab extends Component {
	constructor (props) {
		super(props);
		this._hasUnmounted = false;
		this.state = {
			showPopover: false,
			shareableLink: '',
			activeList: '',
			message: '',
			showToast: false
		};

		this.setShowPopover = this.setShowPopover.bind(this);
	}

	setShowPopover = async (showPopover) => {
		if (showPopover) {
			await this.generateShareLink();
		}
		this.setState({ showPopover: showPopover });
	};

	generateShareLink = async () => {
		let uid = this.props.store.currentUser.uid;
		let activeList = this.state.activeList || await this.props.store.getCurrentList();
		let newLink = `${window.location.origin}/share/${uid}/${activeList.id}`;

		this.setState({
			shareableLink: newLink
		});
	};

	async componentDidMount () {
		if (this._hasUnmounted) {
			return;
		}
		try {
			// this.setState({
			// 	currentList: await this.props.store.getCurrentList()
			// });
		} catch (error) {
			console.error('error found', error);
		}
	}

	componentWillUnmount () {
		this._hasUnmounted = true;
	}

	render () {
		return (
			<>
				<IonFab vertical="bottom" horizontal="end" onClick={() => this.setShowPopover(true)}>
					<IonFabButton><IonIcon icon={share}/></IonFabButton>
				</IonFab>
				<IonPopover
					isOpen={this.state.showPopover}
					onDidDismiss={e => this.setShowPopover(false)}
				>
					<IonListHeader style={{
						fontWeight: 'bold'
					}}>
						Link to share
					</IonListHeader>

					<IonItemSliding>
						<IonItem>
							<IonLabel style={{
								wordBreak: 'break-all',
								whiteSpace: 'normal'
							}}>{this.state.shareableLink}
							</IonLabel>
						</IonItem>
					</IonItemSliding>
					<CopyToClipboard text={this.state.shareableLink}>
						<IonButton expand="full" onClick={()=>{
							this.setState({
								showToast: true,
								message: 'Link copied to Clipboard'
							})
						}}>
							COPY LINK
							<IonIcon slot="end" icon={copy}/>
						</IonButton>
					</CopyToClipboard>
					<IonToast
						isOpen={this.state.showToast}
						onDidDismiss={() => this.setState(() => ({ showToast: false }))}
						message={this.state.message}
						duration={2000}
					/>
					<IonButton
						color="danger"
						expand="full"
						onClick={e => this.setShowPopover(false)}
					>
						<IonIcon slot="end" icon={exit}/>
						CLOSE
					</IonButton>
				</IonPopover>
			</>
		);
	}
}

export default withRouter(inject('store')(observer(ShareListFab)));
