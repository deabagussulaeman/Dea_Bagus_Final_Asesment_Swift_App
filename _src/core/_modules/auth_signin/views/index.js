import React from 'react';
import MobileView from '@app/_modules/auth_signin/views/mobile';
import TabletView from '@app/_modules/auth_signin/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AuthSignInViews = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AuthSignInViews;
