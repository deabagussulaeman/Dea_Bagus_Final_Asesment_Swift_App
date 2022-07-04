import React from 'react';
import MobileView from '@app/_modules/account_trackorder/views/mobile';
import TabletView from '@app/_modules/account_trackorder/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AccountTrackOrderViews = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AccountTrackOrderViews;
