import React from 'react';
import MobileView from '@app/_modules/cart_checkout/atoms/BlockPaymentMethod/views/mobile/_billing';
import TabletView from '@app/_modules/cart_checkout/atoms/BlockPaymentMethod/views/tablet/_billing';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const CheckoutBillingForm = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default CheckoutBillingForm;
