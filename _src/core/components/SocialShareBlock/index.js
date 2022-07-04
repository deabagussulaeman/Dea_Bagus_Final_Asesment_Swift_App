import React from 'react';
import MobileView from '@app/components/SocialShareBlock/views/mobile';
import TabletView from '@app/components/SocialShareBlock/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const SocialShareBlock = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default SocialShareBlock;
