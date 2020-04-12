import React from 'react';
import { IonFabButton, IonFab, IonIcon, IonFabList } from '@ionic/react';
import { ellipsisVerticalOutline } from 'ionicons/icons';

import ShareFabButton from './ShareAction';
import GoShoppingAction from './GoShoppingAction';


const ShoppingActions = ({model}) => (
  <IonFab vertical="bottom" horizontal="end">
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