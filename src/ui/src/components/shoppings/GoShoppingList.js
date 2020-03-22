import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { observer, inject } from 'mobx-react';
import BasicPage from '../basicpage/BasicPage';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
	IonList,
	IonFab,
	IonItem,
	IonLabel,
	IonPopover,
	IonButton,
	IonFabButton,
	IonIcon,
	IonListHeader,
	IonItemSliding
} from '@ionic/react';
import Item from './Item';
import { share, exit, copy } from 'ionicons/icons';

class GoShoppingList extends Component {
	constructor (props) {
		super(props);
		this._hasUnmounted = false;
		this.state = { items: [], showPopover: false, shareableLink: '', activeList: '' };

		this.setShowPopover = this.setShowPopover.bind(this);
	}

	setShowPopover = async (showPopover) => {
		if (showPopover) {
			await this.generateShareLink();
		}
		this.setState({ showPopover: showPopover });
	};

	generateShareLink = async () => {
		let uid = this.props.store.activeUser.uid;
		let activeList = this.state.activeList || await this.props.store.getCurrentList();
		console.log('activeLIst', activeList);
		let newLink = `${window.location.origin}/share/${uid}/${activeList.id}`;

		this.setState({
			shareableLink: newLink
		});
	};

	handleCopyLink = () => {
		// get link from the state
		// use https://www.npmjs.com/package/react-copy-to-clipboard
	};

	async componentDidMount () {
		if (this._hasUnmounted) {
			return;
		}
		try {
			this.setState({
				currentList: await this.props.store.getCurrentList()
			});
		} catch (error) {
			console.error('error found', error);
		}
		try {
			const items = await this.props.store.getMyItems();
			if (!this._hasUnmounted) {
				this.setState({ items });
			}
		} catch (error) {
			console.error('error found', error);
		}
	}

	componentWillUnmount () {
		this._hasUnmounted = true;
	}

	itemClicked (item) {
		this.setState({ items: this.state.items.map(i => i.id === item.id ? { ...item, checked: !item.checked } : i) });
	}

	render () {
		return <BasicPage
			title="Go Shopping"
			store={this.props.store}
			renderContent={history => {
				return (
					<>
						<IonList>
							{this.state.items.map((item, key) => (<Item
								key={item.id || key}
								item={item}
								ownList={true}
								mode={'goshopping'}
								onItemClicked={() => this.itemClicked(item)}
							/>))}
						</IonList>
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
								<IonButton
									expand="full"
									onClick={this.handleCopyLink}
								>
									COPY LINK
									<IonIcon slot="end" icon={copy}/>
								</IonButton>
							</CopyToClipboard>
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
			}}
		/>;
	}
}

export default withRouter(inject('store')(observer(GoShoppingList)));
