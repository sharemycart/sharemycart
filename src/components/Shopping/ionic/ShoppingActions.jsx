import React from 'react';
import { IonFabButton, IonFab, IonIcon, IonFabList } from '@ionic/react';
import { ellipsisVerticalOutline } from 'ionicons/icons';

import ShareFabButton from './ShareAction';
import GoShoppingAction from './GoShoppingAction';

import './shoppingActions.scss'

const ShoppingActions = ({model}) => (
  <IonFab vertical="bottom" horizontal="end" className="shopping-actions">
    <IonFabButton>
      <IonIcon icon={ellipsisVerticalOutline} />
    </IonFabButton>
    <IonFabList side="top">
      <ShareFabButton />
      <GoShoppingAction model={model} />
    </IonFabList>
  </IonFab>
)

export default ShoppingActions;