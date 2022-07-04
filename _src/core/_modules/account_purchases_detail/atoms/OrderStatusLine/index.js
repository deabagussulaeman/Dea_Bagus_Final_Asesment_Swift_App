import React from 'react';
import MobileView from '@app/_modules/account_purchases_detail/atoms/OrderStatusLine/views/mobile';
import TabletView from '@app/_modules/account_purchases_detail/atoms/OrderStatusLine/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const OrderStatusLine = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default OrderStatusLine;
