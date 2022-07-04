import React from 'react';
import MobileView from '@app/components/ErrorBoundaryView/views/mobile';
import TabletView from '@app/components/ErrorBoundaryView/views/tablet';
import {isBigDevice} from '@app/styles/mixins';

const ErrorBoundaryView = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return <View {...props} />;
};

export default ErrorBoundaryView;
