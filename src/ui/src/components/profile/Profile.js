import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import {
	IonPage,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonButton,
	IonItem,
	IonLabel,
	IonIcon,
	IonAvatar,
	IonCol,
	IonRow
} from '@ionic/react';

// MOBX
import { inject, observer } from 'mobx-react';
import TabContainer from '../tabs/TabContainer';
import { logOut } from 'ionicons/icons';
import BasicPage from '../basicpage/BasicPage';

class Profile extends Component {
	constructor (props) {
		super(props);
		this.state = {};
		this._onLogoutClick = this._onLogoutClick.bind(this);
	}

	_onLogoutClick = async e => {
		e.preventDefault();
		await this.props.store.doLogout();
		this.props.history.push('/login');
	};

	render () {
		let user = this.props.store.activeUser;
		if (!user) {
			return <Redirect to="/login"/>;
		}

		const size = 200;
		let userImage = user ? user.photoURL : null;
		let src = userImage ? userImage : ('https://www.gravatar.com/avatar?d=monsterid&s=' + size);

		return (
			<BasicPage
				title="Profile"
				store={this.props.store}
				renderContent={history => {
					return (
						<>
							<TabContainer/>
							<IonItem>
								<IonAvatar style={{ width: size, height: size }}>
									<img src={src} title="Image from Gravatar"/>
								</IonAvatar>
							</IonItem>
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
						</>
					);
				}}
			>
			</BasicPage>
		);
	}
}

export default withRouter(inject('store')(observer(Profile)));
