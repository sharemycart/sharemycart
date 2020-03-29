import React from 'react';
import { Switch, Route } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import NeedsList from './NeedsList';
import Needs from './Needs';
import { withEmailVerification, withAuthorization } from '../Session';
import { compose } from 'recompose';

const NeedsPage = () => (
    <Switch>
      <Route exact path={ROUTES.NEEDS_LIST} component={NeedsList} />
      <Route exact path={ROUTES.NEEDS} component={Needs} />
    </Switch>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(NeedsPage);
