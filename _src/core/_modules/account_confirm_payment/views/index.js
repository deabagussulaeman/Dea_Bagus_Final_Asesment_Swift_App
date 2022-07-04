import React from 'react';
import MobileView from '@app/_modules/account_confirm_payment/views/mobile';
import TabletView from '@app/_modules/account_confirm_payment/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AccountConfirmPaymentViews = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AccountConfirmPaymentViews;
