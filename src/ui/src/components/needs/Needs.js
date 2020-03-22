import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import {
	IonPage,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar
} from '@ionic/react';

// MOBX
import { inject, observer } from 'mobx-react';
import TabContainer from '../tabs/TabContainer';
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
							<TabContainer
								history={this.props.history}
							/>
						</>
					);
				}}
			>
			</BasicPage>
		);
	}
}

export default withRouter(inject('store')(observer(Needs)));
