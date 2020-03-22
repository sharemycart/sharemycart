import React from 'react';

import {
	IonIcon,
	IonLabel,
	IonTabBar,
	IonTabButton,
	IonTabs,
	IonContent,
	IonFooter
} from '@ionic/react';
import { cart, magnet, person } from 'ionicons/icons';

//
// value is used to let us know what view to render
//
// 0 = SHOES, 1 = SOCKS, 2 = CART
const TabContainer = () => {
	return (
		<IonFooter>
			<IonTabBar>
				<IonTabButton tab="home" href="/home">
					<IonIcon icon={cart}/>
					<IonLabel>Shoppings</IonLabel>
				</IonTabButton>
				<IonTabButton tab="needs" href="/needs">
					<IonIcon icon={magnet}/>
					<IonLabel>Needs</IonLabel>
				</IonTabButton>
				<IonTabButton tab="profile" href="/profile">
					<IonIcon icon={person}/>
					<IonLabel>Profile</IonLabel>
				</IonTabButton>
			</IonTabBar>
		</IonFooter>
	);
};

export default TabContainer;
