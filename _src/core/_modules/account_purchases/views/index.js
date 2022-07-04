import React from 'react';
import MobileView from '@app/_modules/account_purchases/views/mobile';
import TabletView from '@app/_modules/account_purchases/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AccountPurchasesViews = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AccountPurchasesViews;
