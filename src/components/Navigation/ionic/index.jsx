import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

// import { ellipse, square, triangle } from 'ionicons/icons';
import SignUpPage from '../../SignUp/ionic'
import SignInPage from '../../SignIn/ionic'
import PasswordForgetPage from '../../PasswordForget/ionic'
import PasswordChangePage from '../../PasswordChange/ionic'
import AccountPage from '../../Account/ionic'
import AdminPage from '../../Admin/simple-ui'
import ShoppingPage from '../../Shopping/ionic'
import GoShoppingPage from '../../GoShopping/ionic'
import FinishShoppingPage from '../../FinishShopping/ionic'
import ShoppingListsPage from '../../ShoppingLists/ionic'
import NeedsPage from '../../Needs/ionic'
import NeedsListsPage from '../../NeedsLists/ionic'
import SharedShoppingList from '../../Needs/ionic/SharedShoppingList'

import { useLocation } from 'react-router-dom'

import { Trans } from 'react-i18next'

import * as ROUTES from '../../../constants/routes'
import {
	// IonIcon,
	IonLabel,
	IonRouterOutlet,
	IonTabBar,
	IonTabButton,
	IonTabs,
	IonIcon
} from '@ionic/react'

import { cartOutline, personOutline, lockClosed, shareSocialOutline } from 'ionicons/icons'

export const NavigationAuth = () => (
	<>
		<IonTabs>
			<IonRouterOutlet>
				<Route path={ROUTES.PASSWORD_FORGET} render={() => <PasswordForgetPage />} />
				<Route path={ROUTES.PASSWORD_CHANGE} render={() => <PasswordChangePage />} />
				<Route path={ROUTES.ACCOUNT} render={() => <AccountPage />} />
				<Route path={ROUTES.SHOPPING_LISTS} render={() => <ShoppingListsPage />} />
				<Route path={ROUTES.SHOPPING} render={() => <ShoppingPage />} />
				<Route path={ROUTES.FINISH_SHOPPING} render={() => <FinishShoppingPage />} />
				<Route path={ROUTES.GO_SHOPPING} render={() => <GoShoppingPage />} />
				<Route path={ROUTES.NEEDS_LISTS} render={() => <NeedsListsPage />} />
				<Route path={ROUTES.NEEDS} render={() => <NeedsPage />} />
				<Route path={ROUTES.SHARED_SHOPPING_LIST} component={SharedShoppingList} />
				<Route path={ROUTES.ADMIN} render={() => <AdminPage />} />
				<Redirect exact from={ROUTES.SIGN_IN} to={ROUTES.SHOPPING} />
				<Redirect exact from={ROUTES.SIGN_UP} to={ROUTES.SHOPPING} />
				<Redirect exact from="/" to={ROUTES.SHOPPING} />
			</IonRouterOutlet>
			<IonTabBar slot="bottom">
				<IonTabButton tab="Shopping" href={ROUTES.SHOPPING} data-test="tab-btn-shopping">
					<IonIcon icon={cartOutline} />
					<IonLabel><Trans>Shopping</Trans></IonLabel>
				</IonTabButton>
				<IonTabButton tab="Needs" href={ROUTES.NEEDS} data-test="tab-btn-needs">
					<IonIcon icon={shareSocialOutline} />
					<IonLabel><Trans>Shared</Trans></IonLabel>
				</IonTabButton>
				<IonTabButton tab="Account" href={ROUTES.ACCOUNT} data-test="tab-btn-account">
					<IonIcon icon={personOutline} />
					<IonLabel><Trans>Account</Trans></IonLabel>
				</IonTabButton>
			</IonTabBar>
		</IonTabs>
	</>
)


export const NavigationNonAuth = () => {
	const currentLocation = useLocation()
	return (
		<IonTabs>
			<IonRouterOutlet>
				<Switch>
					<Route path={ROUTES.SIGN_UP} component={SignUpPage} />
					<Route path={ROUTES.SIGN_IN} component={SignInPage} />
					<Route path={ROUTES.PASSWORD_FORGET} render={() => <PasswordForgetPage />} />
					<Redirect from="/" to={{
						pathname: ROUTES.SIGN_IN,
						state: { from: currentLocation }
					}} />
				</Switch>
			</IonRouterOutlet>
			<IonTabBar slot="bottom">
				<IonTabButton tab="Sign In" href={ROUTES.SIGN_IN} data-test="tab-btn-signin">
					<IonIcon icon={lockClosed} />
					<IonLabel>Sign In</IonLabel>
				</IonTabButton>
			</IonTabBar>
		</IonTabs>
	)
}

const Navigation = ({ sessionStore }) => {
	return sessionStore.authUser ? (
		<NavigationAuth authUser={sessionStore.authUser} />
	) : (
		<NavigationNonAuth authUser={sessionStore.authUser} />
	)
}

export default compose(
	inject('sessionStore'),
	observer,
)(Navigation)

// The following was a try of using a protected route redirect.
// However, this lead to issues when not being authenticated.
// Keeping it here commented for further reference.
// Making it the default export will show the issues
// const AuthAwareNavigation = () => (
//     <>
//         <IonTabs>
//             <IonRouterOutlet>
//                 <Route path={ROUTES.SIGN_UP} render={() => <SignUpPage />} />
//                 <Route path={ROUTES.SIGN_IN} render={() => <SignInPage />} />
//                 <Route path={ROUTES.PASSWORD_FORGET} render={() => <PasswordForgetPage />} />
//                 <PrivateRoute path={ROUTES.ACCOUNT} render={() => <AccountPage />} />
//                 <PrivateRoute path={ROUTES.SHOPPING} render={() => <ShoppingPage />} />
//                 <PrivateRoute path={ROUTES.NEEDS} render={() => <NeedsPage />} />
//                 <PrivateRoute path={ROUTES.SHARED_SHOPPING_LIST} render={() => <SharedShoppingList />} />
//                 <PrivateRoute path={ROUTES.ADMIN} render={() => <AdminPage />} />
//                 <Redirect exact from="/" to={ROUTES.SHOPPING} />
//             </IonRouterOutlet>
//             <IonTabBar slot="bottom">
//                 <IonTabButton tab="Shopping" href={ROUTES.SHOPPING}>
//                     {/* <IonIcon icon={triangle} /> */}
//                     <IonLabel>Shopping</IonLabel>
//                 </IonTabButton>
//                 <IonTabButton tab="Needs" href={ROUTES.NEEDS}>
//                     {/* <IonIcon icon={ellipse} /> */}
//                     <IonLabel>Needs</IonLabel>
//                 </IonTabButton>
//                 <IonTabButton tab="Account" href={ROUTES.ACCOUNT}>
//                     {/* <IonIcon icon={square} /> */}
//                     <IonLabel>Account</IonLabel>
//                 </IonTabButton>
//             </IonTabBar>
//         </IonTabs>
//     </>
// )
//
// export default AuthAwareNavigation
// export default compose(
//     inject('sessionStore'),
//     observer,
// )(AuthAwareNavigation);
