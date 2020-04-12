import React from 'react';
import { GO_SHOPPING } from '../../../constants/routes';
import { IonFabButton, IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { cartOutline } from 'ionicons/icons';
import { withRouter } from 'react-router-dom';

import '../../Reusables/fabButtonTitle.scss'

const GoShoppingAction = () => {
    const { t } = useTranslation()
        return (
            <IonFabButton fill="clear" href={GO_SHOPPING} title={t('Go Shopping')}>
                <IonIcon icon={cartOutline} />
            </IonFabButton>
        )
    }

export default withRouter(GoShoppingAction)