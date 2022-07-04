import React from 'react';
import MobileView from '@app/components/_AppModal/atoms/ModalAuthSignin/views/mobile';
import TabletView from '@app/components/_AppModal/atoms/ModalAuthSignin/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AtomModalAuthSignin = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AtomModalAuthSignin;
