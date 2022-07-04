import React from 'react';
import MobileView from '@app/_modules/cart/atoms/QuantityModal/views/mobile';
import TabletView from '@app/_modules/cart/atoms/QuantityModal/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const QuantityModal = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default QuantityModal;
