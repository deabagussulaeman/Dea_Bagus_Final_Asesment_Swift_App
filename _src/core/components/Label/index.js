import React from 'react';
import MobileView from '@app/components/Label/views/mobile';
import TabletView from '@app/components/Label/views/tablet';
import {isBigDevice} from '@app/styles/mixins';

const Label = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return <View {...props} />;
};

export default Label;
