import React from 'react';
import MobileView from '@app/_modules/account_update_information/views/mobile';
import TabletView from '@app/_modules/account_update_information/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AccountUpdateInformationViews = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AccountUpdateInformationViews;
