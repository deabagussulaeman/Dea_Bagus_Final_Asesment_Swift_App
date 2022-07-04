import React from 'react';
import Section from '@app/components/Section/index';
import Shimmer from '@app/components/_Shimmer/index';

const AtomShimmerCartItem = () => {
  return (
    <Section row paddingHorizontal={20} marginTop={20}>
      <Section width={'35%'}>
        <Shimmer
          wrapperStyle={{borderRadius: 10, height: 120, width: '100%'}}
        />
      </Section>
      <Section width={'65%'} paddingLeft={10}>
        <Shimmer wrapperStyle={{borderRadius: 10, width: '100%', height: 20}} />
        <Section marginTop={10}>
          <Shimmer
            wrapperStyle={{borderRadius: 10, width: '100%', height: 20}}
          />
        </Section>
      </Section>
    </Section>
  );
};

export default AtomShimmerCartItem;
