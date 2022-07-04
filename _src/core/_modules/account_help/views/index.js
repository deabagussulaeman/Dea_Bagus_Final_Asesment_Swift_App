import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/_modules/account_help/views/mobile';
import TabletView from '@app/_modules/account_help/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const HelpView = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default HelpView;
