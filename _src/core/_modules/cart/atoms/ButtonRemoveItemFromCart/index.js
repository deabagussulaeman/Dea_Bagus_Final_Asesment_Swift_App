import React from 'react';
import MobileView from '@app/_modules/cart/atoms/ButtonRemoveItemFromCart/views/mobile';
import TabletView from '@app/_modules/cart/atoms/ButtonRemoveItemFromCart/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const ButtonRemoveItemFromCart = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default ButtonRemoveItemFromCart;
