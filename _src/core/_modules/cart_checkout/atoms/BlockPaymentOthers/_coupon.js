import React from 'react';
import MobileView from '@app/_modules/cart_checkout/atoms/BlockPaymentOthers/views/mobile/_coupon';
import TabletView from '@app/_modules/cart_checkout/atoms/BlockPaymentOthers/views/tablet/_coupon';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const CheckoutCouponCode = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default CheckoutCouponCode;
