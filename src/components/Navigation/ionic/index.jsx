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

const Navigation = () => (
        <>
            <IonTabs>
                <IonRouterOutlet>
                    <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                    <Route path={ROUTES.SIGN_IN} component={SignInPage} />
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
    export const NavigationNonAuth = () => (
        <IonTabs>
            <IonRouterOutlet>
                <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
                <Redirect from="/" to={ROUTES.SIGN_IN} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="Sign in" href={ROUTES.SIGN_IN}>
                    {/* <IonIcon icon={triangle} /> */}
                    <IonLabel>Sign in</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
export default Navigation
