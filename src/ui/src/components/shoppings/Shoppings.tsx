import React, {useState} from 'react';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonFooter} from '@ionic/react';
import { cartOutline } from 'ionicons/icons';

import './Shoppings.css';

export const Shoppings: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>My Shoppings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonSearchbar placeholder="Type to create a new shopping list" searchIcon={cartOutline} value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>
            </IonContent>
        </IonPage>
    );
};

export default Shoppings;
