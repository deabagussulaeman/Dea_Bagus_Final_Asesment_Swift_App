import React from 'react';
import MobileView from '@app/_modules/account_myreturn/views/mobile';
import TabletView from '@app/_modules/account_myreturn/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AccountMyReturnViews = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AccountMyReturnViews;
