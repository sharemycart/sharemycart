import React from 'react';
import { LIFECYCLE_STATUS_SHOPPING, LIFECYCLE_STATUS_FINISHED, LIFECYCLE_STATUS_ARCHIVED } from '../../../constants/lists';
import { IonIcon } from '@ionic/react';
import { cartOutline, receiptOutline, trashBinOutline } from 'ionicons/icons';

const ListLifecycleIcon = ({ list, slot = "", defaultIcon = null }) => {
    if (!list) return null;

    switch (list.lifecycleStatus) {
        case LIFECYCLE_STATUS_SHOPPING:
            return <IonIcon slot={slot} icon={cartOutline} />
        case LIFECYCLE_STATUS_FINISHED:
            return <IonIcon slot={slot} icon={receiptOutline} />
        case LIFECYCLE_STATUS_ARCHIVED:
            return <IonIcon slot={slot} icon={trashBinOutline} />
        default:
            return defaultIcon && <IonIcon slot={slot} icon={defaultIcon} />
    }
}

export default ListLifecycleIcon