import Show from '@app/components/Show';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import {Colors} from '@app/styles';
import React from 'react';
import {StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {rxUserFontSize, rxUserTheme} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import {DARK} from '@app/helpers/Constants';
import PropTypes from 'prop-types';

const Button = ({
  label,
  onPress,
  disabled = false,
  styleProp = {},
  textStyleProp = {},
  loading = false,
  width: widthProp,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  const getRxUserFontSize = useReactiveVar(rxUserFontSize);

  let width = 100;
  if (widthProp) {
    width = widthProp;
  }

  return (
    <Section
      onPress={onPress}
      borderColor={getRxUserTheme === DARK ? Colors.WHITE : Colors.BLACK}
      borderRadius={15}
      width={width * getRxUserFontSize}
      horizontalCenter
      verticalCenter
      style={[
        {borderColor: getRxUserTheme === 'dark' ? '#fff' : '#000'},
        styleProp,
      ]}
      disabled={disabled}>
      <Show when={loading}>
        <ActivityIndicator
          style={{
            padding: 5,
          }}
        />
      </Show>
      <Show when={!loading}>
        <Label
          center
          color={textStyleProp.color ? textStyleProp.color : null}
          style={[styles.textStyle, textStyleProp]}>
          {label}
        </Label>
      </Show>
    </Section>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    padding: 10,
  },
});

Button.propTypes = {
  // label name
  label: PropTypes.string,
  // function click
  onPress: PropTypes.func,
  // disabled
  disabled: PropTypes.bool,
  // style props
  styleProp: PropTypes.any,
  // style props for text
  textStyleProp: PropTypes.object,
  // loading state
  loading: PropTypes.bool,
  // width
  width: PropTypes.number,
};

export default Button;
