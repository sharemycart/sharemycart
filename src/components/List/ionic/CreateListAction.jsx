import React from 'react';
import { IonFabButton, IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';

import '../../Reusables/fabButtonTitle.scss'

const CreateListAction = ({ onClick, title }) => (
    <IonFabButton color="primary" title={title} onClick={onClick}>
        <IonIcon icon={addOutline} />
    </IonFabButton>
)

export default CreateListAction