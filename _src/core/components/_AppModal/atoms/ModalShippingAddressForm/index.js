import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/components/_AppModal/atoms/ModalShippingAddressForm/views/mobile';
import TabletView from '@app/components/_AppModal/atoms/ModalShippingAddressForm/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AtomModalShippingAddressForm = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AtomModalShippingAddressForm;
