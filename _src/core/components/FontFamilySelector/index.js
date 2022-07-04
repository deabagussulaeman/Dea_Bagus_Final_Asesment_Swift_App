import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/components/FontFamilySelector/views/mobile';
import TabletView from '@app/components/FontFamilySelector/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const FontFamilySelector = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default FontFamilySelector;
