import Section from '@app/components/Section';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {useReactiveVar} from '@apollo/client';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Mixins} from '@app/styles';
import {rxUserTheme} from '@app/services/cache';
import {DARK} from '@app/helpers/Constants';
import PropTypes from 'prop-types';

const CheckBox = ({
  style,
  onPress,
  selected,
  radius = 3,
  size = 25,
  uncheckedColor: uncheckedColorProp,
  checkedColor: checkedColorProp,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  let uncheckedColor;
  if (uncheckedColorProp) {
    uncheckedColor = uncheckedColorProp;
  } else {
    uncheckedColor = getRxUserTheme === DARK ? Colors.WHITE : Colors.BLACK;
  }

  let checkedColor;
  if (checkedColorProp) {
    checkedColor = checkedColorProp;
  } else {
    checkedColor = getRxUserTheme === DARK ? Colors.WHITE : Colors.BLACK;
  }

  const sizeStyle = {
    height: size,
    width: size,
    borderRadius: radius,
  };

  const backgroundColor = {
    backgroundColor: checkedColor,
  };

  const borderColor = {
    borderColor: selected ? checkedColor : uncheckedColor,
  };

  const renderChecbox = () => {
    return (
      <Section style={[backgroundColor, sizeStyle, styles.centerOfContent]}>
        <Icon
          name={'ios-checkmark'}
          size={Platform.OS === 'ios' ? 21 : 20}
          color={getRxUserTheme === DARK ? Colors.BLACK : Colors.WHITE}
        />
      </Section>
    );
  };

  return (
    <Section
      onPress={onPress}
      style={[
        borderColor,
        sizeStyle,
        styles.container,
        styles.centerOfContent,
        style,
      ]}
      border={2}>
      {selected ? renderChecbox() : null}
    </Section>
  );
};

const styles = StyleSheet.create({
  centerOfContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    borderWidth: 0.5,
    ...Mixins.margin(5, 0, 5, 0),
  },
});

CheckBox.propTypes = {
  // style
  style: PropTypes.object,
  // func click
  onPress: PropTypes.func,
  // selected
  selected: PropTypes.bool,
  // border radius
  radius: PropTypes.number,
  // size for height & width
  size: PropTypes.number,
  // unchecked color
  uncheckedColor: PropTypes.any,
  // checked color
  checkedColor: PropTypes.any,
};

export default CheckBox;
