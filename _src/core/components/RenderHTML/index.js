import React from 'react';
import MobileView from '@app/components/RenderHTML/views/mobile';
import TabletView from '@app/components/RenderHTML/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const RenderHTML = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default RenderHTML;
