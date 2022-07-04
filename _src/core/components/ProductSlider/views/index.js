import React from 'react';
import MobileView from '@app/components/ProductSlider/views/mobile';
import TabletView from '@app/components/ProductSlider/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const ProductSliderView = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default ProductSliderView;
