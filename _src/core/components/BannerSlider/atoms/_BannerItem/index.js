import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/components/BannerSlider/atoms/_BannerItem/views/mobile';
import TabletView from '@app/components/BannerSlider/atoms/_BannerItem/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const BannerItem = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default React.memo(BannerItem);
