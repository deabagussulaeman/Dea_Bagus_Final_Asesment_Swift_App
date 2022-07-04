import React from 'react';
import MobileView from '@app/_modules/auth_signup/views/mobile';
import TabletView from '@app/_modules/auth_signup/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AuthSignUpViews = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AuthSignUpViews;