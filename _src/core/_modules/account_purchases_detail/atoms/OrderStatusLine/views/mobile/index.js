import React from 'react';
import {Colors, Mixins} from '@app/styles';
import Section from '@app/components/Section';

const OrderStatusLine = () => {
  return (
    <Section
      height={2}
      width={Math.ceil((Mixins.MAX_WIDTH * 0.8 - 200) * 0.3)}
      borderColor={Colors.BLACK}
      border={1.5}
      flex
      style={{
        alignSelf: 'flex-start',
        marginTop: Mixins.normalize(25),
      }}
    />
  );
};

export default OrderStatusLine;
