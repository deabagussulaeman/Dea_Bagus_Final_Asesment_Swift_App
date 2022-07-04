import {Mixins, Colors} from '@app/styles';
import React from 'react';
import Section from '@app/components/Section';
import PropTypes from 'prop-types';

const Container = ({
  backgroundColor: backgroundColorProp,
  centerChildren,
  children,
  flex: flexProp,
  height: heightProp,
  style,
  width: widthProp,
}) => {
  let backgroundColor = Colors.WHITE;
  if (backgroundColorProp) {
    backgroundColor = backgroundColorProp;
  }

  let alignItems = 'flex-start';
  let justifyContent = 'flex-start';
  if (centerChildren) {
    alignItems = 'center';
    justifyContent = 'center';
  }

  let flex = 0;
  if (flexProp) {
    typeof flexProp === 'boolean' ? (flex = 1) : (flex = flexProp);
  }

  let height = 'auto';
  if (heightProp) {
    height = heightProp;
  }

  let width = Mixins.MAX_WIDTH;
  if (widthProp) {
    width = widthProp;
  }

  return (
    <Section
      style={[
        {
          alignItems,
          backgroundColor,
          flex,
          justifyContent,
          height,
          width,
        },
        style,
      ]}>
      {children}
    </Section>
  );
};

Container.propTypes = {
  // background color
  backgroundColor: PropTypes.string,
  // center
  centerChildren: PropTypes.any,
  // children
  children: PropTypes.any,
  // flex
  flex: PropTypes.number,
  // height
  height: PropTypes.string,
  // style prop
  style: PropTypes.object,
  // width
  width: PropTypes.any,
};

export default Container;
