import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// MOBX
import { inject, observer } from 'mobx-react';
import BasicPage from '../basicpage/BasicPage';

class Needs extends Component {

	render () {
		return (
			<BasicPage
				title="My Needs"
				store={this.props.store}
				renderContent={history => {
					return (
						<>
							Not implemented yet
						</>
					);
				}}
			>
			</BasicPage>
		);
	}
}

export default withRouter(inject('store')(observer(Needs)));
