import React from 'react';
import {isBigDevice} from '@app/styles/mixins';
import MobileView from '@app/components/ImagePicker/views/mobile';
import TabletView from '@app/components/ImagePicker/views/tablet';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const ImagePickerComponent = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default ImagePickerComponent;
