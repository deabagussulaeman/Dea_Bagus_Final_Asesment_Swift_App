import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/components/PageBuilder/atoms/WidgetSliderCategory/views/mobile';
import TabletView from '@app/components/PageBuilder/atoms/WidgetSliderCategory/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const WidgetSliderCategory = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default WidgetSliderCategory;
