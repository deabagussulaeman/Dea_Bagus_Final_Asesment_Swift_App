import React from 'react';
import MobileView from '@app/_modules/product_detail/views/mobile';
import TabletView from '@app/_modules/product_detail/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const ProductDetailViews = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default ProductDetailViews;
