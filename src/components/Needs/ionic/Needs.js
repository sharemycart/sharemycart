import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import NeedsList from './NeedsList';
import { ITEM_TYPE_NEED, ITEM_TYPE_POTENTIAL_NEED } from '../../../constants/items';
class Needs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingListName: '',
    }
  }

  render() {
    const { needsStore, sessionStore } = this.props;
    const {
      currentNeedsList,
      potentiallyNeededItemsArray: potentiallyNeededItems,
      currentNeedsListItemsArray: currentNeedsListItems,
      currentOriginShoppingList,
    } = needsStore;

    return (
      <>
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

        {/* Potentially needed */}
        {currentOriginShoppingList &&
          <NeedsList
            authUser={sessionStore.authUser}
            list={currentOriginShoppingList}
            items={potentiallyNeededItems}
            onCreateItem={this.props.model.onCreateItemForCurrentNeedsList}
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
