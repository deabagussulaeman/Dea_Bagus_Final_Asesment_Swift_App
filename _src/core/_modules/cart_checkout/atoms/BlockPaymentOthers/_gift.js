import React from 'react';
import MobileView from '@app/_modules/cart_checkout/atoms/BlockPaymentOthers/views/mobile/_gift';
import TabletView from '@app/_modules/cart_checkout/atoms/BlockPaymentOthers/views/tablet/_gift';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const CheckoutGiftCard = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default CheckoutGiftCard;
