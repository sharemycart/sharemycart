import React from 'react';
import { SHOPPING, GO_SHOPPING } from '../../../constants/routes';
import { IonFabButton, IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { cartOutline } from 'ionicons/icons';
import { withRouter } from 'react-router-dom';

import '../../Reusables/fabButtonTitle.scss'

const ShoppingPhaseAction = (props) => {
    const { t } = useTranslation()
    if (props.location.pathname === SHOPPING) {
        return (
            <IonFabButton fill="clear" href={GO_SHOPPING} title={t('Go Shopping')}>
                <IonIcon icon={cartOutline} />
            </IonFabButton>
        )
    }
    // if (props.location.pathname === GO_SHOPPING) {
    //     return (
    //         <IonFabButton fill="clear" href={SHOPPING} title={t('Plan Shopping')}>
    //             <IonIcon icon={documentTextOutline} />
    //         </IonFabButton>
    //     )
    // }
    return null
}

export default withRouter(ShoppingPhaseAction)