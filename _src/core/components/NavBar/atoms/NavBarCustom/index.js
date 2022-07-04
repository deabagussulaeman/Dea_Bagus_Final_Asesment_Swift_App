import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/components/NavBar/atoms/NavBarCustom/views/mobile';
import TabletView from '@app/components/NavBar/atoms/NavBarCustom/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const NavBarCustom = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default NavBarCustom;
