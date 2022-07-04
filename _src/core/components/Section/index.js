import React from 'react';
import MobileView from '@app/components/Section/views/mobile';
import TabletView from '@app/components/Section/views/tablet';
import {isBigDevice} from '@app/styles/mixins';

const Section = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return <View {...props} />;
};

export default Section;
