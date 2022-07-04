import React from 'react';
import Section from '@app/components/Section/index';
import Shimmer from '@app/components/_Shimmer/index';

const AtomShimmerCheckoutShippingMethod = () => {
  return (
    <Section paddingHorizontal={10} marginBottom={10}>
      <Section width={'100%'}>
        <Shimmer wrapperStyle={{borderRadius: 5, height: 25, width: '100%'}} />
      </Section>
      <Section width={'100%'} marginTop={10}>
        <Shimmer wrapperStyle={{borderRadius: 5, height: 25, width: '100%'}} />
      </Section>
      <Section width={'100%'} marginTop={10}>
        <Shimmer wrapperStyle={{borderRadius: 5, height: 25, width: '100%'}} />
      </Section>
    </Section>
  );
};

export default AtomShimmerCheckoutShippingMethod;
