import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../../Navigation/simple-ui';
import SignUpPage from '../../SignUp/simple-ui';
import SignInPage from '../../SignIn/simple-ui';
import PasswordForgetPage from '../../PasswordForget/simple-ui';
import AccountPage from '../../Account/simple-ui';
import AdminPage from '../../Admin/simple-ui';
import ShoppingPage from '../../Shopping/simple-ui';
import NeedsPage from '../../Needs/simple-ui';

import * as ROUTES from '../../../constants/routes';
import { withAuthentication } from '../../Session';

const App = () => (
  <Router>
    <div>
      <Navigation />

      <hr />

      <Route exact path={ROUTES.LANDING} component={ShoppingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.SHOPPING} component={ShoppingPage} />
      <Route path={ROUTES.NEEDS} component={NeedsPage} />
      <Route path={ROUTES.SHARED_SHOPPING_LIST} component={NeedsPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
    </div>
  </Router>
);

export default withAuthentication(App);
