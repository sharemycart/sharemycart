import React from 'react';
import { inject } from 'mobx-react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.props.sessionStore.setAuthUser(
        JSON.parse(localStorage.getItem('authUser')),
      );

      this.listener = null;

      // Decorate the wrapped components so that it can react on authentication happening
      this.registerAuthListener = (handler) => {
        this.listener = handler;
        return true;
      };
    }

    componentDidMount() {
      this.unregisterHandler = this.props.firebase.onAuthUserListener(
        (authUser) => {
          localStorage.setItem('authUser', JSON.stringify(authUser));
          this.props.sessionStore.setAuthUser(authUser);
          this.listener && this.listener(authUser);
        },
        () => {
          localStorage.removeItem('authUser');
          this.props.sessionStore.setAuthUser(null);
          this.listener && this.listener(null);
        },
      );
    }

    componentWillUnmount() {
      this.unregisterHandler();
    }

    render() {
      return (
        <Component
          {...this.props}
          registerAuthListener={this.registerAuthListener}
        />
      );
    }
  }

  return compose(
    withFirebase,
    inject('sessionStore'),
  )(WithAuthentication);
};

export default withAuthentication;
