import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import {
	IonContent
} from '@ionic/react';

// MOBX
import { inject, observer } from 'mobx-react';
import TabContainer from '../tabs/TabContainer';
import BasicPage from '../basicpage/BasicPage';

class ShoppingsPage extends Component {

	render () {
		return (
			<BasicPage
				title="My Shoppings"
				store={this.props.store}
				renderContent={history => {
					return (
						<IonContent>
							<TabContainer history={this.props.history}/>
						</IonContent>
					);
				}}
			>
			</BasicPage>
		);
	}
}

export default withRouter(inject('store')(observer(ShoppingsPage)));
