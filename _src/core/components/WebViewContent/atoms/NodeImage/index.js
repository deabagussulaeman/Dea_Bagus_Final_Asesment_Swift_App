import React from 'react';
import MobileView from '@app/components/WebViewContent/atoms/NodeImage/views/mobile';
import TabletView from '@app/components/WebViewContent/atoms/NodeImage/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const NodeImage = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default NodeImage;
