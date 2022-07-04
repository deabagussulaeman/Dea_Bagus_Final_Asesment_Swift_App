import React from 'react';
import MobileView from '@app/components/Input/atoms/InputField/views/mobile';
import TabletView from '@app/components/Input/atoms/InputField/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const InputFieldComponent = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default InputFieldComponent;
