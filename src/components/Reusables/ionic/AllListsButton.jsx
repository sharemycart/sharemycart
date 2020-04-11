import React from 'react';

import { IonButton, IonIcon } from '@ionic/react';
import { listOutline } from 'ionicons/icons';

import { Trans } from 'react-i18next';

const AllListsButton = ({href, label}) => (
    <IonButton fill="clear"
        href={href}>
        <Trans>{label}</Trans>
        <IonIcon slot="start" icon={listOutline} />
    </IonButton>
)

export default AllListsButton