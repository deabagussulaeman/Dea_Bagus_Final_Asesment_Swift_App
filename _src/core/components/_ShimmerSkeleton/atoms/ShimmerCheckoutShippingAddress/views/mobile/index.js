import React from 'react';
import Section from '@app/components/Section/index';
import Shimmer from '@app/components/_Shimmer/index';

const AtomShimmerCheckoutShippingAddress = () => {
  return (
    <Section>
      <Section width={'70%'}>
        <Shimmer wrapperStyle={{borderRadius: 5, height: 25, width: '100%'}} />
      </Section>
      <Section width={'60%'} marginTop={10}>
        <Shimmer wrapperStyle={{borderRadius: 5, height: 25, width: '100%'}} />
      </Section>
      <Section width={'80%'} marginTop={10}>
        <Shimmer wrapperStyle={{borderRadius: 5, height: 25, width: '100%'}} />
      </Section>
    </Section>
  );
};

export default AtomShimmerCheckoutShippingAddress;
