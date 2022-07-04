import React from 'react';
import MobileView from '@app/components/NotificationModal/views/mobile';
import TabletView from '@app/components/NotificationModal/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const NotificationModal = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default NotificationModal;
