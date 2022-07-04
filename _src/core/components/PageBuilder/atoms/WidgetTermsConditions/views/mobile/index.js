import React from 'react';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import {MixinsNew} from '@app/styles';
import PropTypes from 'prop-types';

const WidgetTermsConditions = ({children}) => {
  return (
    <Section
      horizontalCenter
      width={MixinsNew.MAX_WIDTH}
      paddingHorizontal={20}>
      {children.map((child, index) => {
        if (child.name === 'h1') {
          return (
            <Label key={index} xlarge bold style={{paddingVertical: 10}}>
              {child.children[0].data}
            </Label>
          );
        } else if (child.name === 'p') {
          return (
            <Label key={index} justify>
              {child.children[0].data}
            </Label>
          );
        }
      })}
    </Section>
  );
};

WidgetTermsConditions.propTypes = {
  // children
  children: PropTypes.any,
};

export default WidgetTermsConditions;
