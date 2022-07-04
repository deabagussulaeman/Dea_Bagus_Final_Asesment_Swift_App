import React from 'react';
import MobileView from '@app/components/ToggleWishlist/views/mobile';
import TabletView from '@app/components/ToggleWishlist/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const ToggleWishlist = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default ToggleWishlist;
