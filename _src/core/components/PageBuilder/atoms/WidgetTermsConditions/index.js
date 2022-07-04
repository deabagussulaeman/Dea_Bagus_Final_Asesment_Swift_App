import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/components/PageBuilder//atoms/WidgetTermsConditions/views/mobile';
import TabletView from '@app/components/PageBuilder//atoms/WidgetTermsConditions/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const WidgetTermsConditions = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default WidgetTermsConditions;
