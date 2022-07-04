import React from 'react';
import Section from '@app/components/Section/index';
import Shimmer from '@app/components/_Shimmer/index';

const AtomShimmerAccountMyPoint = () => {
  return (
    <Section marginTop={10} width={'60%'}>
      <Shimmer wrapperStyle={{borderRadius: 5, height: 29, width: '100%'}} />
    </Section>
  );
};

export default AtomShimmerAccountMyPoint;
