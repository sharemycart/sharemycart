import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import NeedsList from './NeedsList';
import { ITEM_TYPE_NEED, ITEM_TYPE_POTENTIAL_NEED } from '../../../constants/items';
import SplashLogo from '../../Reusables/ionic/SplashLogo';
import { IonGrid, IonCol, IonRow, IonItem, IonList, IonText } from '@ionic/react';
import LoadingAnimation from '../../Reusables/ionic/LoadingAnimation';
import { LIFECYCLE_STATUS_OPEN, LIFECYCLE_STATUS_SHOPPING, LIFECYCLE_STATUS_FINISHED, LIFECYCLE_STATUS_ARCHIVED } from '../../../constants/lists';
import CreateItem from '../../Item/ionic/CreateItem';
import { Trans } from 'react-i18next';

const INITIAL_ITEM = {
  name: '',
  quantity: '',
  unit: ''
}
class Needs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingListName: '',
      itemInCreation: { ...INITIAL_ITEM },
    }
  }

  onCreatingItemChange(event) {
    this.setState({
      itemInCreation:
        Object.assign(this.state.itemInCreation, { [event.target.name]: event.target.value })
    });
  }

  onCreateComplete(newItem) {
    if (!newItem.name || !newItem.quantity) {
      return;
    }
    this.props.model.onCreateItemForCurrentNeedsList(this.state.itemInCreation, newItem)
    this.setState({ itemInCreation: { ...INITIAL_ITEM } })
  }

  copyPotentialNeed(potentialNeed) {
    // this.setState({
    //   itemInCreation: { ...potentialNeed, quantity: '' }
    // })
    const quantity = potentialNeed.unit && potentialNeed.quantity >= 100
      ? 100
      : 1
      this.props.model.onCreateItemForCurrentNeedsList(potentialNeed, Object.assign(potentialNeed, {quantity}))
  }

  render() {
    const { needsStore, sessionStore } = this.props;
    const {
      currentNeedsList,
      potentiallyNeededItemsArray: potentiallyNeededItems,
      currentNeedsListItemsArray: currentNeedsListItems,
      currentOriginShoppingList,
      initializationDone,
    } = needsStore;

    const { itemInCreation } = this.state

    const itemHasBeenCopied = (itemInCreation && itemInCreation.name)

    const createNeedsVisible =
      currentNeedsList && currentNeedsList.lifecycleStatus === LIFECYCLE_STATUS_OPEN
      && (itemHasBeenCopied
        || (currentOriginShoppingList && currentOriginShoppingList.allowCreateOwnNeeds)) // user is allowed to define own needs
      &&
      <IonList>
        <IonItem key="createItem">
          <CreateItem
            item={itemInCreation}
            onChange={this.onCreatingItemChange.bind(this)}
            onEditingConcluded={this.onCreateComplete.bind(this)}
            highlight={itemHasBeenCopied}
            mode={ITEM_TYPE_NEED}
          />
        </IonItem>
      </IonList>

    const createNeedsNotAllowed = currentOriginShoppingList
      && !currentOriginShoppingList.allowCreateOwnNeeds
      && currentOriginShoppingList.lifecycleStatus === LIFECYCLE_STATUS_OPEN
      &&
      <IonItem color="warning" className="permanent-message">
        <IonText>
          <Trans>Creating_own_items_disabled</Trans>
        </IonText>
      </IonItem>

    const NothingSharedYet = () => (
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonItem>
              <SplashLogo
                maxWidth="150px"
                textStart="Nothing"
                textEnd="SharedYet"
              />
            </IonItem>
          </IonCol>
        </IonRow>

      </IonGrid>
    )

    const StatusMessage = ({ lifecycleStatus }) => {

      if (lifecycleStatus === LIFECYCLE_STATUS_OPEN) return null
      const messageMapping = {}
      messageMapping[LIFECYCLE_STATUS_SHOPPING] = <Trans>Edit_not_possible_shopping</Trans>
      messageMapping[LIFECYCLE_STATUS_FINISHED] = <Trans>Edit_not_possible_finished</Trans>
      messageMapping[LIFECYCLE_STATUS_ARCHIVED] = <Trans>Edit_not_possible_archived</Trans>

      return <IonItem color="warning" className="permanent-message">
        {messageMapping[lifecycleStatus]}
      </IonItem>
    }

    if (!initializationDone) return <LoadingAnimation loading={initializationDone} />

    return (
      <>
        {currentOriginShoppingList && <StatusMessage lifecycleStatus={currentOriginShoppingList.lifecycleStatus} />}
        {createNeedsVisible}
        {/* Needs */}
        {currentNeedsList &&
          <NeedsList
            authUser={sessionStore.authUser}
            list={currentOriginShoppingList}
            items={currentNeedsListItems}
            onCreateItem={this.props.model.onCreateItemForCurrentNeedsList}
            onEditItem={this.props.model.onEditNeededItem}
            onDeleteItem={this.props.model.onRemoveNeededItem}
            ownList={true}
            mode={ITEM_TYPE_NEED}
          />
        }

        {!currentNeedsList &&
          <NothingSharedYet />
        }

        {/* Potentially needed */}
        {currentOriginShoppingList &&
          <NeedsList
            authUser={sessionStore.authUser}
            list={currentOriginShoppingList}
            items={potentiallyNeededItems}
            onCreateItem={(template) => this.copyPotentialNeed(template)}
            onEditItem={this.props.model.onEditNeededItem}
            onDeleteItem={this.props.model.onRemoveNeededItem}
            ownList={false}
            mode={ITEM_TYPE_POTENTIAL_NEED}
          />
        }

        {createNeedsNotAllowed}

      </>
    );
  }
}

export default compose(
  inject('needsStore', 'sessionStore'),
  observer,
)(Needs);
