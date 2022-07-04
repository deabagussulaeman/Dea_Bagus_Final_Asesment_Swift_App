import Section from '@app/components/Section';
import React, {useState} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {useReactiveVar} from '@apollo/client';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Mixins} from '@app/styles';
import {rxUserTheme} from '@app/services/cache';
import {DARK} from '@app/helpers/Constants';
import Show from '@app/components/Show';

const RadioButton = ({
  style,
  onPress,
  selected,
  radius = 3,
  size = 13,
  uncheckedColor: uncheckedColorProp,
  checkedColor: checkedColorProp,
}) => {
  /**
   * ----------------------------------------- *
   * @constant
   * @summary list of constant local state
   * ----------------------------------------- *
   */
  const scheme = useReactiveVar(rxUserTheme);
  const [checked, setChecked] = useState(selected);

  let uncheckedColor;
  if (uncheckedColorProp) {
    uncheckedColor = uncheckedColorProp;
  } else {
    uncheckedColor = scheme === DARK ? Colors.WHITE : Colors.BLACK;
  }

  let checkedColor;
  if (checkedColorProp) {
    checkedColor = checkedColorProp;
  } else {
    checkedColor = scheme === DARK ? Colors.WHITE : Colors.BLACK;
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
    borderColor: uncheckedColor,
  };

  const onPressCheck = () => {
    setChecked(!checked);
    onPress(!checked);
  };

  const renderChecbox = () => {
    return (
      <Section style={[backgroundColor, sizeStyle, styles.centerOfContent]}>
        <Icon
          name={'ios-checkmark'}
          size={Platform.OS === 'ios' ? 15 : 18}
          color={scheme === DARK ? Colors.WHITE : Colors.WHITE}
        />
      </Section>
    );
  };

  return (
    <Section
      onPress={onPressCheck}
      style={[
        borderColor,
        sizeStyle,
        styles.container,
        styles.centerOfContent,
        style,
      ]}>
      <Show when={checked}>{renderChecbox()}</Show>
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

export default RadioButton;
