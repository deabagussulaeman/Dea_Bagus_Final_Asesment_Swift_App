import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/components/_AppModal/atoms/ModalShippingAddressList/views/mobile';
import TabletView from '@app/components/_AppModal/atoms/ModalShippingAddressList/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const ModalShippingAddressList = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default ModalShippingAddressList;
