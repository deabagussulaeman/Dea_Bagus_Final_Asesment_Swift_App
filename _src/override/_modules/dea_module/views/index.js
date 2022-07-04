import React from 'react';
import MobileView from '@app/_modules/dea_module/views/mobile';
import TabletView from '@app/_modules/dea_module/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const DeaModuleViews = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default DeaModuleViews;
