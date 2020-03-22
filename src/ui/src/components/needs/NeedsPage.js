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
import TabContainer from '../TabContainer';

class NeedsPage extends Component {
	constructor (props) {
		super(props);
	}

	render () {
		return (
			<IonPage>
				<IonHeader>
					<IonToolbar color="primary">
						<IonTitle>My Needs</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<TabContainer
						history={this.props.history}
					/>
				</IonContent>
			</IonPage>
		);
	}
}

export default withRouter(inject('store')(observer(NeedsPage)));
