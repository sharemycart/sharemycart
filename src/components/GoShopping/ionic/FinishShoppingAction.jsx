import React from 'react';
import { FINISH_SHOPPING } from '../../../constants/routes';
import { IonFabButton, IonIcon } from '@ionic/react';
import { receiptOutline } from 'ionicons/icons';
import { withRouter } from 'react-router-dom';

import '../../Reusables/fabButtonTitle.scss'

const GoShoppingAction = () => {
        return (
            <IonFabButton fill="clear" href={FINISH_SHOPPING}>
                <IonIcon icon={receiptOutline} />
            </IonFabButton>
        )
    }

export default withRouter(GoShoppingAction)