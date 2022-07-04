import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/_modules/cart_checkout/atoms/BlockPaymentOthers/views/mobile/_point';
import TabletView from '@app/_modules/cart_checkout/atoms/BlockPaymentOthers/views/tablet/_point';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const CheckoutMyPoint = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default CheckoutMyPoint;
