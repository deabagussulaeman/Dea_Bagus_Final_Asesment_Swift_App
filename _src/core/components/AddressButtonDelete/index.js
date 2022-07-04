import React from 'react';
import MobileView from '@app/components/AddressButtonDelete/views/mobile';
import TabletView from '@app/components/AddressButtonDelete/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const AddressButtonDelete = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default AddressButtonDelete;
