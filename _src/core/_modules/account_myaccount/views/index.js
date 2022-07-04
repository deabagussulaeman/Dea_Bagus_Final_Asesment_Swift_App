import React from 'react';
import MobileView from '@app/_modules/account_myaccount/views/mobile';
import TabletView from '@app/_modules/account_myaccount/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AccountMyAccountViews = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AccountMyAccountViews;
