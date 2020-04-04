import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { withFirebase } from '../components/Firebase';

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    if (
      !(
        this.props.userStore.users &&
        this.props.userStore.users[this.props.match.params.id]
      )
    ) {
      this.setState({ loading: true });
    }

    this.unsubscribe = this.props.firebase
      .user(this.props.match.params.id)
      .onSnapshot(snapshot => {
        this.props.userStore.setUser(
          this.props.match.params.id,
          snapshot.data(),

        );

        this.setState({ loading: false });
      });
  }

  render = () => (<span />)

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  onSendPasswordResetEmail = () => {
    this.props.firebase.doPasswordReset(
      this.props.userStore.users[this.props.match.params.id].email,
    );
  };
}

export default compose(
  withFirebase,
  inject('userStore'),
  observer,
)(User);
