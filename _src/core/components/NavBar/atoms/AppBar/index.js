import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/components/NavBar/atoms/AppBar/views/mobile';
import TabletView from '@app/components/NavBar/atoms/AppBar/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AppBarComponent = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AppBarComponent;
