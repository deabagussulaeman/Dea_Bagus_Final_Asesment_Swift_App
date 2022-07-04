import Section from '@app/components/Section';
import React from 'react';
import {Colors} from '@app/styles';
import {useReactiveVar} from '@apollo/client';
import {rxUserTheme} from '@app/services/cache';
import PropTypes from 'prop-types';

const RadioButton = ({
  style,
  onPress,
  selected,
  size = 16,
  color: colorProp,
  activeColor = null,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  let color;
  if (colorProp) {
    color = colorProp;
  } else {
    color = getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK;
  }

  const containerStyle = {
    height: size,
    width: size,
    borderRadius: size / 2,
    borderColor: color,
  };

  const radioStyle = {
    height: size / 2,
    width: size / 2,
    borderRadius: 6,
    backgroundColor: activeColor ? activeColor : color,
  };

  return (
    <Section
      horizontalCenter
      verticalCenter
      onPress={onPress}
      border={1}
      borderColor={getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK}
      style={[containerStyle, style]}>
      {selected ? <Section style={radioStyle} /> : null}
    </Section>
  );
};

RadioButton.propTypes = {
  // style
  style: PropTypes.object,
  // func click
  // onPress: PropTypes.func || PropTypes.bool,
  onPress: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  // select state
  selected: PropTypes.bool,
  // size for height, width
  size: PropTypes.number,
  // color
  color: PropTypes.string,
  // active color bg
  activeColor: PropTypes.string,
};

export default RadioButton;
