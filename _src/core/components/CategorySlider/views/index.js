import React from 'react';
import MobileView from '@app/components/CategorySlider/views/mobile';
import TabletView from '@app/components/CategorySlider/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const CategorySlider = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default CategorySlider;
