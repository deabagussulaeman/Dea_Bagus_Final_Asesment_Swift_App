import React from 'react';
import MobileView from '@app/components/_AppModal/atoms/ModalAddressInput/views/mobile';
import TabletView from '@app/components/_AppModal/atoms/ModalAddressInput/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const ModalAddressInput = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default ModalAddressInput;
