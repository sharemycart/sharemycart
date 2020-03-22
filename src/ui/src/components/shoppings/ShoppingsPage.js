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

class ShoppingsPage extends Component {

	render () {
		return (
			<IonPage>
				<IonHeader>
					<IonToolbar color="primary">
						<IonTitle>My Shoppings</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<TabContainer history={this.props.history}/>
				</IonContent>
			</IonPage>
		);
	}
}

export default withRouter(inject('store')(observer(ShoppingsPage)));
