import React from 'react';
import MobileView from '@app/_modules/account_change_password/views/mobile';
import TabletView from '@app/_modules/account_change_password/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AccountChangePasswordViews = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AccountChangePasswordViews;
