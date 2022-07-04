import React from 'react';
import MobileView from '@app/_modules/cart_checkout/atoms/BoxAuth/views/mobile';
import TabletView from '@app/_modules/cart_checkout/atoms/BoxAuth/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const BoxAuth = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default BoxAuth;
