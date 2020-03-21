import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs
} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {cart, magnetOutline, person} from 'ionicons/icons';
import Shoppings from '../shoppings/Shoppings';
import Needs from '../needs/Needs';
import Profile from '../profile/Profile';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import '../../theme/variables.css';

const App: React.FC = () => (
    <IonApp>
        <IonReactRouter>
            <IonTabs>
                <IonRouterOutlet>
                    <Route path="/shoppings" component={Shoppings} exact={true}/>
                    <Route path="/needs" component={Needs} exact={true}/>
                    <Route path="/profile" component={Profile}/>
                    <Route path="/" render={() => <Redirect to="/shoppings"/>} exact={true}/>
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                    <IonTabButton tab="shoppings" href="/shoppings">
                        <IonIcon icon={cart}/>
                        <IonLabel>Shoppings</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="needs" href="/needs">
                        <IonIcon icon={magnetOutline}/>
                        <IonLabel>Needs</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="profile" href="/profile">
                        <IonIcon icon={person}/>
                        <IonLabel>Profile</IonLabel>
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
        </IonReactRouter>
    </IonApp>
);

export default App;
