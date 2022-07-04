import React from 'react';
import MobileView from '@app/components/ShareButton/views/mobile';
import TabletView from '@app/components/ShareButton/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const ShareButton = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default ShareButton;
