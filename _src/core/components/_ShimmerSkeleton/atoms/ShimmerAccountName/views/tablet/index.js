import React from 'react';
import Section from '@app/components/Section/index';
import Shimmer from '@app/components/_Shimmer/index';

const AtomShimmerAccountName = () => {
  return (
    <>
      <Section marginBottom={10} width={'60%'}>
        <Shimmer wrapperStyle={{borderRadius: 5, height: 24, width: '100%'}} />
      </Section>
      <Section width={'70%'}>
        <Shimmer wrapperStyle={{borderRadius: 5, height: 18, width: '100%'}} />
      </Section>
    </>
  );
};

export default AtomShimmerAccountName;
