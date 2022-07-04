import React from 'react';
import MobileView from '@app/components/_ShimmerSkeleton/atoms/ShimmerAccountMyPoint/views/mobile';
import TabletView from '@app/components/_ShimmerSkeleton/atoms/ShimmerAccountMyPoint/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AtomShimmerAccountMyPoint = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AtomShimmerAccountMyPoint;
