import React from 'react';
import MobileView from '@app/components/Input/atoms/InputCustom/views/mobile';
import TabletView from '@app/components/Input/atoms/InputCustom/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const InputCustom = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default InputCustom;
