import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/_modules/product_detail/atoms/ConfigurableOptions/views/mobile';
import TabletView from '@app/_modules/product_detail/atoms/ConfigurableOptions/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const ConfigurableOptions = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default ConfigurableOptions;
