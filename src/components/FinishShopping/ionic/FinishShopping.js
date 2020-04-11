import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';


import LoadingAnimation from '../../Reusables/ionic/LoadingAnimation';
import { withRouter } from 'react-router';
import { ITEM_TYPE_NEED } from '../../../constants/items';
import NeedsList from '../../Needs/ionic/NeedsList';
import Avatar from '../../Reusables/ionic/Avatar';
import { IonItem, IonList, IonLIonLabel, IonLabel, IonGrid, IonRow, IonHeader, IonTitle, IonCol } from '@ionic/react';
import { Trans } from 'react-i18next';

class FinishShopping extends Component {

  render() {
    const { shoppingStore } = this.props;
    const {
      currentShoppingList,
      currentShoppingListItemsArray: currentShoppingListItems,
      currentDependentNeedsListsArray: currentDependentNeedsLists,
      currentDependentNeedsListsItemsArray: currentDependentNeedsListsItems,
      initializationDone,
    } = shoppingStore;

    if (!initializationDone) return <LoadingAnimation loading={initializationDone} />

    return (
      currentShoppingList &&
      <IonList>
        <IonItem key={currentShoppingList.userId}>
          <IonGrid>
            <IonRow>
              <IonTitle><Trans>My own shopped items</Trans></IonTitle>
            </IonRow>
            <IonRow>
              <NeedsList
                list={currentShoppingList}
                items={currentShoppingListItems.filter(item => !!item.shopped)}
                ownList={false}
                mode={ITEM_TYPE_NEED}
              />
            </IonRow>
          </IonGrid>
        </IonItem>
        {currentDependentNeedsLists && currentDependentNeedsLists.map(dependentNeedsList => {
          const broughtAlongItems = currentDependentNeedsListsItems
            .filter(item => !!item.shopped && (item.ownerId === dependentNeedsList.userId))
          if (!broughtAlongItems.length) return null
          const owner = this.props.userStore.users[dependentNeedsList.userId]
          return (
            <IonItem key={dependentNeedsList.userId}>
              <IonGrid>
                {owner &&
                  <IonRow>
                    <IonTitle><Trans>For</Trans>&nbsp;{owner.username}</IonTitle>
                  <Avatar user={owner} size="50px" />
                  </IonRow>
                }
                <IonRow>
                  <NeedsList
                    list={dependentNeedsList}
                    items={broughtAlongItems}
                    ownList={false}
                    mode={ITEM_TYPE_NEED}
                  />
                </IonRow>
              </IonGrid>
            </IonItem>
          )
        })}
      </IonList>
    );
  }
}

export default compose(
  withRouter,
  inject('shoppingStore', 'userStore'),
  observer,
)(FinishShopping);
