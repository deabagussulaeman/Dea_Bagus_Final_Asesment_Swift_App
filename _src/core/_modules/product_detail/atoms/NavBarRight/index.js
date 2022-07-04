import React from 'react';
import MobileView from '@app/_modules/product_detail/atoms/NavBarRight/views/mobile';
import TabletView from '@app/_modules/product_detail/atoms/NavBarRight/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const NavBarRightView = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default NavBarRightView;
