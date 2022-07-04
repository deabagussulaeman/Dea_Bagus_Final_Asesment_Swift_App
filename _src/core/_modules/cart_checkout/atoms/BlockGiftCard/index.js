import React from 'react';
import MobileView from '@app/_modules/cart_checkout/atoms/BlockGiftCard/views/mobile';
import TabletView from '@app/_modules/cart_checkout/atoms/BlockGiftCard/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const BlockGiftCard = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default BlockGiftCard;
