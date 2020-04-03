import React from 'react';
import { Route, Redirect } from 'react-router';
import { compose } from 'recompose';
import { inject } from 'mobx-react';

import { SIGN_IN } from '../../constants/routes';

const PrivateRoute = ({ component: Component, sessionStore, ...rest }) => (
    <Route {...rest} render={(props) => (
        sessionStore.authUser
            ? <Component {...props} />
            : <Redirect to={{
                pathname: SIGN_IN,
                state: { from: props.location }
            }} />
    )} />
)

export default compose(
    inject('sessionStore')
)(PrivateRoute)