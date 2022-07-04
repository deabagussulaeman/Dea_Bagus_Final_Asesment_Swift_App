import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/_modules/product_detail/atoms/ProductDetailBlock/views/mobile';
import TabletView from '@app/_modules/product_detail/atoms/ProductDetailBlock/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const ProductDetailBlock = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default ProductDetailBlock;
