import React from 'react';
import MobileView from '@app/components/BannerSlider/atoms/BannerSliderImage/views/mobile';
import TabletView from '@app/components/BannerSlider/atoms/BannerSliderImage/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const BannerSliderImage = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default BannerSliderImage;
