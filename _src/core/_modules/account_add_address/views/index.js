import React from 'react';
import MobileView from '@app/_modules/account_add_address/views/mobile';
import TabletView from '@app/_modules/account_add_address/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AccountAddAddressViews = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AccountAddAddressViews;
