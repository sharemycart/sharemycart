import React from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { ellipse, square, triangle } from 'ionicons/icons';
import SignUpPage from '../../SignUp/simple-ui';
import SignInPage from '../../SignIn/simple-ui';
import PasswordForgetPage from '../../PasswordForget/simple-ui';
import AccountPage from '../../Account/ionic';
import AdminPage from '../../Admin/simple-ui';
import ShoppingPage from '../../Shopping/ionic';
import NeedsPage from '../../Needs/ionic';

import { useLocation } from 'react-router-dom'

import * as ROUTES from '../../../constants/routes';
import {
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs
} from '@ionic/react';
import PrivateRoute from '../PrivateRoute';
import NeedsInSharedShoppingList from '../../Needs/simple-ui/NeedsInSharedShoppingList';

export const NavigationAuth = ({ authUser }) => (
    <>
        <IonTabs>
            <IonRouterOutlet>
                <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
                <Route path={ROUTES.ACCOUNT} component={AccountPage} />
                <Route path={ROUTES.SHOPPING} component={ShoppingPage} />
                <Route path={ROUTES.NEEDS} component={NeedsPage} />
                <Route path={ROUTES.SHARED_SHOPPING_LIST} component={NeedsInSharedShoppingList} />
                <Route path={ROUTES.ADMIN} component={AdminPage} />
                <Redirect exact from="/" to={ROUTES.SHOPPING} />

            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="Shopping" href={ROUTES.SHOPPING}>
                    {/* <IonIcon icon={triangle} /> */}
                    <IonLabel>Shopping</IonLabel>
                </IonTabButton>
                <IonTabButton tab="Needs" href={ROUTES.NEEDS}>
                    {/* <IonIcon icon={ellipse} /> */}
                    <IonLabel>Needs</IonLabel>
                </IonTabButton>
                <IonTabButton tab="Account" href={ROUTES.ACCOUNT}>
                    {/* <IonIcon icon={square} /> */}
                    <IonLabel>Account</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    </>
)


export const NavigationNonAuth = (props) => {
    const currentLocation = useLocation()
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
                <Redirect from="/" to={{
                    pathname: ROUTES.SIGN_IN,
                    state: { from: currentLocation }
                }} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="Sign in" href={ROUTES.SIGN_IN}>
                    {/* <IonIcon icon={triangle} /> */}
                    <IonLabel>Sign in</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    )
}

const Navigation = ({ sessionStore }) => {
    console.log('Navigation requested', sessionStore.authUser)
    return sessionStore.authUser ? (
        <NavigationAuth authUser={sessionStore.authUser} />
    ) : (
            <NavigationNonAuth authUser={sessionStore.authUser}/>
        );
}

export default compose(
    inject('sessionStore'),
    observer,
)(Navigation);

// The following was a try of using a protected route redirect.
// However, this lead to issues when not being authenticated.
// Keeping it here commented for further reference.
// Making it the default export will show the issues
// const AuthAwareNavigation = () => (
//     <>
//         <IonTabs>
//             <IonRouterOutlet>
//                 <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
//                 <Route path={ROUTES.SIGN_IN} component={SignInPage} />
//                 <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
//                 <PrivateRoute path={ROUTES.ACCOUNT} component={AccountPage} />
//                 <PrivateRoute path={ROUTES.SHOPPING} component={ShoppingPage} />
//                 <PrivateRoute path={ROUTES.NEEDS} component={NeedsPage} />
//                 <PrivateRoute path={ROUTES.SHARED_SHOPPING_LIST} component={NeedsInSharedShoppingList} />
//                 <PrivateRoute path={ROUTES.ADMIN} component={AdminPage} />
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
