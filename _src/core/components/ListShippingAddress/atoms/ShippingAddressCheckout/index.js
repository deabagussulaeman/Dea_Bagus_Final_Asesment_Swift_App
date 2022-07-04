import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/components/ListShippingAddress/atoms/ShippingAddressCheckout/views/mobile';
import TabletView from '@app/components/ListShippingAddress/atoms/ShippingAddressCheckout/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const ListShippingAddressCheckout = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default ListShippingAddressCheckout;
