import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import {
	IonApp,
	IonRouterOutlet,
	IonSpinner,
	IonReactRouter
} from '@ionic/react';

import PrivateRoute from '../basicpage/PrivateRoute';
import ShoppingsPage from '../shoppings/ShoppingsPage';
import LoginPage from '../auth/LoginPage';
import RegistrationPage from '../auth/RegistrationPage';

import { inject, observer } from 'mobx-react';
import NeedsPage from '../needs/NeedsPage';
import ProfilePage from '../profile/ProfilePage';

class App extends Component {
	render () {
		return !this.props.store.authCheckComplete ? (
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)'
				}}
			>
				<IonSpinner name="circles"/>
			</div>
		) : (
			<IonReactRouter>
				<IonApp>
					<Switch>
						<Redirect exact from="/" to="home"/>
						<Route path="/login" component={LoginPage}/>
						<IonRouterOutlet>
							<Route path="/register" component={RegistrationPage}/>
							<PrivateRoute name="home" path="/home" component={ShoppingsPage}/>
							<PrivateRoute name="needs" path="/needs" component={NeedsPage}/>
							<PrivateRoute name="profile" path="/profile" component={ProfilePage}/>
						</IonRouterOutlet>
					</Switch>
				</IonApp>
			</IonReactRouter>
		);
	}
}

export default inject('store')(observer(App));
