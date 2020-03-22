import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import {
	IonApp,
	IonRouterOutlet,
	IonSpinner,
	IonReactRouter
} from '@ionic/react';

import PrivateRoute from './components/PrivateRoute';
import ShoppingsPage from './components/shoppings/ShoppingsPage';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';
import TabOneDetailPage from './pages/TabOneDetailPage';

import { inject, observer } from 'mobx-react';
import NeedsPage from './components/needs/NeedsPage';
import ProfilePage from './components/profile/ProfilePage';

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
							<PrivateRoute
								path="/tab1-detail/:id"
								component={TabOneDetailPage}
							/>
						</IonRouterOutlet>
					</Switch>
				</IonApp>
			</IonReactRouter>
		);
	}
}

export default inject('store')(observer(App));
