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
	IonIcon
} from '@ionic/react';

// MOBX
import { inject, observer } from 'mobx-react';
import TabContainer from '../TabContainer';
import { logOut } from 'ionicons/icons';

class ProfilePage extends Component {
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
		return (
			<IonPage>
				<IonHeader>
					<IonToolbar color="primary">
						<IonTitle>Profile</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent padding>
					<TabContainer/>
					<IonItem>
						<IonLabel position="fixed">Email</IonLabel>
						<IonLabel>{user.email}</IonLabel>
					</IonItem>

					<IonItem text-wrap>
						<IonLabel position="fixed">First Name</IonLabel>
						{user.firstName}
					</IonItem>

					<IonItem text-wrap>
						<IonLabel position="fixed">Last Name</IonLabel>
						{user.lastName}
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
				</IonContent>
			</IonPage>
		);
	}
}

export default withRouter(inject('store')(observer(ProfilePage)));
