import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/_modules/cart/atoms/QuantityBlock/views/mobile';
import TabletView from '@app/_modules/cart/atoms/QuantityBlock/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const QuantityBlock = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default QuantityBlock;
