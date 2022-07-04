import React from 'react';
import MobileView from '@app/components/WebViewContent/views/mobile';
import TabletView from '@app/components/WebViewContent/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const WebViewContent = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default WebViewContent;
