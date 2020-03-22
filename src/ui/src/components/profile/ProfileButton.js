import React, { Component, useState } from 'react';

import {
	IonButton,
	IonItem,
	IonLabel,
	IonIcon,
	IonPopover,
	IonAvatar
} from '@ionic/react';

// MOBX
import { inject, observer } from 'mobx-react';
import TabContainer from '../tabs/TabContainer';
import { logOut } from 'ionicons/icons';

class ProfileButton extends Component {
	constructor (props) {
		super(props);
		this._onLogoutClick = this._onLogoutClick.bind(this);
		this.setShowPopover = this.setShowPopover.bind(this);
		this.state = { showPopover: false };
	}

	setShowPopover = (showPopover) => {
		this.setState({ showPopover: showPopover });
	};

	_onLogoutClick = async e => {
		e.preventDefault();
		await this.props.store.doLogout();
		if (this.props.history) {
			this.props.history.push('/login');
		}
	};

	render () {
		let user = this.props.store.activeUser;
		const size = 32;
		let userImage = user ? user.photoURL : null;
		let src = userImage ? userImage : ('https://www.gravatar.com/avatar?d=monsterid&s=' + size);

		return (
			<>
				<IonButton onClick={() => this.setShowPopover(true)}>
					<IonAvatar style={{ width: size, height: size }}>
						<img src={src}/>
					</IonAvatar>
				</IonButton>
				<IonPopover
					isOpen={this.state.showPopover}
					onDidDismiss={e => this.setShowPopover(false)}
				>
					<IonItem>
						<IonLabel position="fixed">Email</IonLabel>
						<IonLabel>{user.email}</IonLabel>
					</IonItem>

					<IonItem text-wrap>
						<IonLabel position="fixed">First Name</IonLabel>
						{user.firstName || user.displayName}
					</IonItem>

					<IonItem text-wrap>
						<IonLabel position="fixed">Last Name</IonLabel>
						{user.lastName}
					</IonItem>

					<IonItem text-wrap>
						<IonLabel position="fixed">Phone Number</IonLabel>
						{user.phoneNumber}
					</IonItem>

					<IonItem text-wrap lines="none" style={{ padding: 10 }}>
						{user.bio}
					</IonItem>
					<IonButton
						expand="full"
						onClick={this._onLogoutClick}
					>
						LOGOUT
						<IonIcon slot="end" icon={logOut}/>
					</IonButton>
					<IonButton
						color="danger"
						expand="full"
						onClick={e => this.setShowPopover(false)}
					>
						CLOSE
					</IonButton>
				</IonPopover>
			</>
		);
	}
}

export default inject('store')(observer(ProfileButton));
