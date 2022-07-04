import React from 'react';
import MobileView from '@app/components/DialogUpdate/views/mobile';
import TabletView from '@app/components/DialogUpdate/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const DialogUpdate = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default DialogUpdate;
