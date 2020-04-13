import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import NeedsList from './NeedsList';
import { ITEM_TYPE_NEED, ITEM_TYPE_POTENTIAL_NEED } from '../../../constants/items';
import SplashLogo from '../../Reusables/ionic/SplashLogo';
import { IonGrid, IonCol, IonRow, IonItem, IonList } from '@ionic/react';
import LoadingAnimation from '../../Reusables/ionic/LoadingAnimation';
import { LIFECYCLE_STATUS_OPEN } from '../../../constants/lists';
import CreateItem from '../../Item/ionic/CreateItem';
class Needs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingListName: '',
      itemInCreation: null,
    }
  }

  onCreatingItemChange(event){
    this.setState({ itemInCreation: 
      Object.assign(this.state.itemInCreation, {[event.target.name]: event.target.value} )
    });
  }

  onCreateComplete(newItem) {
    if (!newItem.name || !newItem.quantity) {
      return;
    }
    this.props.model.onCreateItemForCurrentNeedsList(this.state.itemInCreation, newItem.quantity)
    this.setState({ itemInCreation: null })
  }

  copyPotentialNeed(potentialNeed) {
    this.setState({
      itemInCreation: {...potentialNeed, quantity: ''}
    })
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

    if (!initializationDone) return <LoadingAnimation loading={initializationDone} />

    const { itemInCreation } = this.state
    return (
      <>
        {currentNeedsList && currentNeedsList.lifecycleStatus === LIFECYCLE_STATUS_OPEN 
            && itemInCreation && itemInCreation.name &&
          <IonList>
            <IonItem>
              <CreateItem
                item={itemInCreation}
                onChange={this.onCreatingItemChange.bind(this)}
                onEditingConcluded={this.onCreateComplete.bind(this)}
                mode={ITEM_TYPE_NEED}
              />
            </IonItem>
          </IonList>}

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
      </>
    );
  }
}

export default compose(
  inject('needsStore', 'sessionStore'),
  observer,
)(Needs);
