import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/components/PageBuilder/atoms/WidgetSliderBanner/views/mobile';
import TabletView from '@app/components/PageBuilder/atoms/WidgetSliderBanner/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const WidgetSliderBanner = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default WidgetSliderBanner;
