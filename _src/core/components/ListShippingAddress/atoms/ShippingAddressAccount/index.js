import React from 'react';
import MobileView from '@app/components/ListShippingAddress/atoms/ShippingAddressAccount/views/mobile';
import TabletView from '@app/components/ListShippingAddress/atoms/ShippingAddressAccount/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const ListShippingAddressAccount = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default ListShippingAddressAccount;
