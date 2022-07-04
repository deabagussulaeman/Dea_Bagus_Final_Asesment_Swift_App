import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/_modules/cart_checkout/atoms/BlockShippingMethod/views/mobile';
import TabletView from '@app/_modules/cart_checkout/atoms/BlockShippingMethod/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const BlockShippingMethod = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default BlockShippingMethod;
