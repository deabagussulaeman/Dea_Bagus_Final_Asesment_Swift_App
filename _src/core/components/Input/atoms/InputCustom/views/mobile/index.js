import Section from '@app/components/Section';
import Label from '@app/components/Label';
import {normalize} from '@app/styles/mixins';
import {Colors} from '@app/styles';
import {useReactiveVar} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {Dimensions, Platform, StyleSheet, TextInput} from 'react-native';
import {rxUserTheme} from '@app/services/cache';
import RNInfo from 'react-native-device-info';

const InputCustom = ({
  placeholder,
  value,
  styleProp = {},
  textStyleProp = {},
  onChangeText = null,
  secureTextEntry = false,
  editable = true,
  keyboardType,
  label = '',
  error = '',
  placeholderTextColor,
  onFocus,
  autoFocus,
  multiline = false,
  numberOfLines = 1,
  caretHidden,
}) => {
  const {Version} = Platform;

  const getRxUserTheme = useReactiveVar(rxUserTheme);

  const brandsNeedingWorkaround = ['redmi', 'xiaomi', 'poco', 'pocophone'];
  const needsXiaomiWorkaround =
    brandsNeedingWorkaround.includes(RNInfo.getBrand().toLowerCase()) &&
    Version > 28;

  const [hackCaretHidden, setHackCaretHidden] = useState(
    needsXiaomiWorkaround ? true : false,
  );

  const handleFocus = useCallback(() => {
    if (needsXiaomiWorkaround) {
      setHackCaretHidden(true);
    }
    if (onFocus) {
      onFocus();
    }
  }, [onFocus, caretHidden]);

  return (
    <Section
      style={[
        styles.mainContainer,
        {borderColor: getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK},
        styleProp,
      ]}>
      {error ? (
        <Label small primary>
          {error}
        </Label>
      ) : (
        <Label small>{label}</Label>
      )}
      <TextInput
        value={value}
        style={[
          {color: getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK},
          styles.inputStyle,
          textStyleProp,
        ]}
        placeholder={placeholder}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        editable={editable}
        keyboardType={keyboardType}
        placeholderTextColor={
          placeholderTextColor
            ? placeholderTextColor
            : getRxUserTheme === 'dark'
            ? Colors.GRAY_DARK
            : Colors.GRAY_MEDIUM
        }
        onFocus={handleFocus}
        autoFocus={autoFocus}
        multiline={multiline}
        numberOfLines={numberOfLines}
        caretHidden={hackCaretHidden}
      />
    </Section>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    paddingVertical: normalize(5),
    paddingHorizontal: 0,
  },
  mainContainer: {
    borderBottomWidth: 1,
    width: Dimensions.get('screen').width * 0.8,
    marginBottom: normalize(15),
  },
});

export default InputCustom;
