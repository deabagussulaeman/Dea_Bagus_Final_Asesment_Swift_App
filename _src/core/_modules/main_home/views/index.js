import React from 'react';
import MobileView from '@app/_modules/main_home/views/mobile';
import TabletView from '@app/_modules/main_home/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const MainHomeViews = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default MainHomeViews;
