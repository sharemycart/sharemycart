
import React from 'react'
import { IonIcon } from '@ionic/react'
import { lockOpenOutline, lockClosedOutline } from 'ionicons/icons'

const AllowCreateOwnNeedsIcon = ({ shoppingList, slot = '', size = '' }) => (
    shoppingList
    && <IonIcon
        size={size}
        slot={slot}
        icon={
            shoppingList.allowCreateOwnNeeds
                ? lockOpenOutline
                : lockClosedOutline
        } />
)

export default AllowCreateOwnNeedsIcon