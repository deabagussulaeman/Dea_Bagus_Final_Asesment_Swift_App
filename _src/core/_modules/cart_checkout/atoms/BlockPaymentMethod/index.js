import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/_modules/cart_checkout/atoms/BlockPaymentMethod/views/mobile';
import TabletView from '@app/_modules/cart_checkout/atoms/BlockPaymentMethod/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const BlockPaymentMethod = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default BlockPaymentMethod;
