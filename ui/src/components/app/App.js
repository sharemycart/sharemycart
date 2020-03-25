import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import {
	IonApp,
	IonRouterOutlet,
	IonSpinner,
	IonReactRouter
} from '@ionic/react';

import PrivateRoute from '../basicpage/PrivateRoute';
import Shoppings from '../shoppings/Shoppings';
import GoShoppingList from '../shoppings/GoShoppingList';
import Login from '../auth/Login';
import RegistrationPage from '../auth/RegistrationPage';

import { inject, observer } from 'mobx-react';
import Needs from '../needs/Needs';
import Profile from '../profile/Profile';

class App extends Component {
	render() {
		const isLoggedIn = !!this.props.store.currentUser

		return !this.props.store.authCheckComplete ? (
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)'
				}}
			>
				<IonSpinner name="circles" />
			</div>
		) : (
				<IonReactRouter>
					<IonApp>
						<Switch>
							<Redirect exact from="/" to="home" />
							<Route path="/login" component={Login} />
							<IonRouterOutlet>
								<Route path="/register" component={RegistrationPage} />
								<PrivateRoute name="home" path="/home" component={isLoggedIn ? Shoppings : Login} />
								<PrivateRoute name="needs" path="/needs" component={isLoggedIn ? Needs : Login} />
								<PrivateRoute name="goshopping" path="/goshopping" component={isLoggedIn ? GoShoppingList : Login} />
								<PrivateRoute name="profile" path="/profile" component={isLoggedIn ? Profile : Login} />
								<PrivateRoute name="share" path="/share/:uid/:listid" component={isLoggedIn ? Needs : Login} />
							</IonRouterOutlet>
						</Switch>
					</IonApp>
				</IonReactRouter>
			);
	}
}

export default inject('store')(observer(App));
