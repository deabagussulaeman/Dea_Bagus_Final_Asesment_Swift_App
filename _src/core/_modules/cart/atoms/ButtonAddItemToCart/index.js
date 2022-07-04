import React from 'react';
import MobileView from '@app/_modules/cart/atoms/ButtonAddItemToCart/views/mobile';
import TabletView from '@app/_modules/cart/atoms/ButtonAddItemToCart/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const ButtonAddItemToCart = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default ButtonAddItemToCart;
