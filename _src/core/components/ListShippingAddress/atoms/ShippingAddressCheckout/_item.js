import React from 'react';
import MobileView from '@app/components/ListShippingAddress/atoms/ShippingAddressCheckout/views/mobile/_item';
import TabletView from '@app/components/ListShippingAddress/atoms/ShippingAddressCheckout/views/tablet/_item';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AtomShippingAddressAccountItem = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AtomShippingAddressAccountItem;
