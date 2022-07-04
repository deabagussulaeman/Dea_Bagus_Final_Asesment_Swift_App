import React from 'react';
import MobileView from '@app/_modules/cart/atoms/CartItemsBlock/views/mobile';
import TabletView from '@app/_modules/cart/atoms/CartItemsBlock/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const CartItemsBlock = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default CartItemsBlock;
