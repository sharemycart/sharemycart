import React from 'react';

import NeedsList from './NeedsList';

const NeedsLists = ({
  authUser,
  needsLists,
  onEditNeedsList,
  onRemoveNeedsList,
  onSetCurrentNeedsList,
}) => (
  <ul>
    {needsLists.map(needsList => (
      <NeedsList
        authUser={authUser}
        key={needsList.uid}
        needsList={needsList}
        onEditNeedsList={onEditNeedsList}
        onRemoveNeedsList={onRemoveNeedsList}
        onSetCurrentNeedsList={onSetCurrentNeedsList}
      />
    ))}
  </ul>
);

export default NeedsLists;
