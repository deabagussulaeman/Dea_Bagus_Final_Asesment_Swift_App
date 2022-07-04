import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/components/BannerSlider/views/mobile';
import TabletView from '@app/components/BannerSlider/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const BannerSlider = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default BannerSlider;
