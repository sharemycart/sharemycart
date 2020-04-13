import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import LoadingAnimation from '../../Reusables/ionic/LoadingAnimation';
import { withRouter } from 'react-router';
import { ITEM_TYPE_NEED, ITEM_TYPE_SHOPPING } from '../../../constants/items';
import NeedsList from '../../Needs/ionic/NeedsList';
import Avatar from '../../Reusables/ionic/Avatar';
import { IonItem, IonList, IonListHeader, IonLabel } from '@ionic/react';
import { Trans } from 'react-i18next';
import ShoppingList from '../../Shopping/ionic/ShoppingList';

class FinishShopping extends Component {
  constructor(props){
    super(props)
    this.statusTransitionTriggered = false;
  }

  componentDidUpdate() {
    if (!this.statusTransitionTriggered && this.props.shoppingStore.currentShoppingList) {
      this.props.model.onFinishShopping(this.props.shoppingStore.currentShoppingList)
      this.statusTransitionTriggered = true
    }
  }

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
        <IonListHeader lines="inset">
          <IonLabel><h1><Trans>My own shopped items</Trans></h1></IonLabel>
        </IonListHeader>
         <NeedsList
           key={currentShoppingList.userId}
           list={currentShoppingList}
           items={currentShoppingListItems.filter(item => !!item.shopped)}
           ownList={false}
                mode={ITEM_TYPE_SHOPPING}
         />
        {currentDependentNeedsLists && currentDependentNeedsLists.map(dependentNeedsList => {
          const broughtAlongItems = currentDependentNeedsListsItems
            .filter(item => !!item.shopped && (item.ownerId === dependentNeedsList.userId))
          if (!broughtAlongItems.length) return null
          const owner = this.props.userStore.users[dependentNeedsList.userId]
          return (
            <>
            <IonItem key={dependentNeedsList.userId}>
                {owner &&
                <>
                    <Avatar user={owner} size="50px" slot="end"/>
                    <IonLabel><h1><Trans>For</Trans>&nbsp;{owner.username}</h1></IonLabel>
                </>
                }
            </IonItem>
            <NeedsList
              list={dependentNeedsList}
              items={broughtAlongItems}
              ownList={false}
              mode={ITEM_TYPE_NEED}
            />
          </>
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
