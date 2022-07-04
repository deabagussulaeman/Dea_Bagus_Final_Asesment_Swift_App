import React from 'react';
import MobileView from '@app/components/_ShimmerSkeleton/atoms/ShimmerCheckoutShippingMethod/views/mobile';
import TabletView from '@app/components/_ShimmerSkeleton/atoms/ShimmerCheckoutShippingMethod/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AtomShimmerCheckoutShippingMethod = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AtomShimmerCheckoutShippingMethod;
