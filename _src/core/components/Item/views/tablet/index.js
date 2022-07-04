import {Colors} from '@app/styles';
import React from 'react';
import Section from '@app/components/Section';
import PropTypes from 'prop-types';

const Item = ({
  backgroundColor: backgroundColorProp,
  border,
  center,
  centerChildren,
  children,
  flex: flexProp,
  height: heightProp,
  radius,
  style,
  width: widthProp,
}) => {
  let backgroundColor = Colors.WHITE;
  if (backgroundColorProp) {
    backgroundColor = backgroundColorProp;
  }

  let alignItems = 'auto';
  let justifyContent = 'flex-start';
  if (centerChildren) {
    alignItems = 'center';
    justifyContent = 'center';
  }

  let alignSelf = 'auto';
  if (center) {
    alignSelf = 'center';
  }

  let borderColor = Colors.WHITE;
  let borderWidth = 0;
  if (border) {
    if (typeof border === 'boolean') {
      borderColor = Colors.BLACK;
    }
    borderColor = border;
    borderWidth = 1;
  }

  let borderRadius = 0;
  if (radius) {
    typeof radius === 'boolean' ? (borderRadius = 15) : (borderRadius = radius);
  }

  let flex = 1;
  if (flexProp) {
    flex = flexProp;
  }

  let height = 'auto';
  if (heightProp) {
    height = heightProp;
  }

  let width = 'auto';
  if (widthProp) {
    width = widthProp;
  }

  return (
    <Section
      style={[
        {
          alignItems,
          alignSelf,
          backgroundColor,
          borderColor,
          borderWidth,
          borderRadius,
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

Item.propTypes = {
  // background color
  backgroundColor: PropTypes.string,
  // border
  border: PropTypes.any,
  // center
  center: PropTypes.any,
  // center children
  centerChildren: PropTypes.any,
  // children
  children: PropTypes.any,
  // flex
  flex: PropTypes.number,
  // height
  height: PropTypes.string,
  // border radius
  radius: PropTypes.any,
  // style
  style: PropTypes.any,
  // width
  width: PropTypes.string,
};

export default Item;
