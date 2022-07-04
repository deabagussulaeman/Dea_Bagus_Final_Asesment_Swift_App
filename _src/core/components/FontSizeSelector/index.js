import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/components/FontSizeSelector/views/mobile';
import TabletView from '@app/components/FontSizeSelector/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const FontSizeSelector = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default FontSizeSelector;
