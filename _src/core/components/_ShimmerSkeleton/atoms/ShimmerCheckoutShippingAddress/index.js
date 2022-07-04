import React from 'react';
import MobileView from '@app/components/_ShimmerSkeleton/atoms/ShimmerCheckoutShippingAddress/views/mobile';
import TabletView from '@app/components/_ShimmerSkeleton/atoms/ShimmerCheckoutShippingAddress/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AtomShimmerCheckoutShippingAddress = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AtomShimmerCheckoutShippingAddress;
