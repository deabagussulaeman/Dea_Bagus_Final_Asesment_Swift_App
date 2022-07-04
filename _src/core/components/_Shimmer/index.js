import React from 'react';
import MobileView from '@app/components/_Shimmer/views/mobile';
import TabletView from '@app/components/_Shimmer/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const Shimmer = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default Shimmer;
