import React, {forwardRef, useState, useCallback} from 'react';
import {TextInput, HelperText, Chip} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import _ from 'lodash';
import {useTheme} from 'react-native-paper';
import PropTypes from 'prop-types';
import Section from '@app/components/Section';
import styles from '@app/components/Input/atoms/InputField//views/mobile/style';
import AtomModalAddressInput from '@app/components/_AppModal/atoms/ModalAddressInput';
import Show from '@app/components/Show';

/**
 * @component InputField
 * @param {Object} ref - to be forwarded to the component
 * @param {Object} InputFieldComponent.propTypes - defined using PropTypes
 * @summary Input field component based on react-native-paper
 * @returns Component
 */

const InputFieldComponent = forwardRef(
  (
    {
      isLast,
      label,
      defaultValue,
      affixLabel,
      autoCapitalized = 'none',
      isPassword = false,
      textContentType = 'none',
      keyboardType = 'default',
      multiline = false,
      editable = true,
      onChange,
      onBlur,
      value,
      error,
      loading,
      isSubmitting,
      data,
      onPress,
      name,
      inputRightCustom,
      multiselect = false,
      onSaveMultiselect,
      onRemoveMultiselect,
    },
    innerRef,
  ) => {
    const theme = useTheme();
    const {primary, placeholder} = _.get(theme, 'colors');
    const [passVisibility, setPassVisibility] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const onOpenModal = useCallback(() => {
      if (data) {
        setShowModal(true);
      }
    }, []);

    const onCloseModal = () => setShowModal(false);

    let onInputRight = null;
    if (inputRightCustom) {
      onInputRight = inputRightCustom;
    }

    if (isPassword) {
      onInputRight = (
        <TextInput.Icon
          onPress={() => setPassVisibility(!passVisibility)}
          name={() => (
            <Icon
              color={primary}
              name={passVisibility ? 'eye-off' : 'eye'}
              size={20}
            />
          )}
        />
      );
    }

    const containerStyle = isLast ? styles.bottomContainer : styles.container;

    return (
      <Section style={containerStyle} onPress={onOpenModal}>
        <Show when={multiselect}>
          {data?.map(item => {
            if (item.selected) {
              return (
                <Section marginBottom={5}>
                  <Chip
                    closeIcon="close"
                    onClose={() => onRemoveMultiselect(item.name)}>
                    {item.name}
                  </Chip>
                </Section>
              );
            }
          })}
        </Show>

        <TextInput
          ref={innerRef}
          mode={'outlined'}
          label={label}
          editable={editable}
          disabled={isSubmitting || loading || data}
          secureTextEntry={isPassword && !passVisibility}
          error={error && error.message}
          onChangeText={onChange}
          onBlur={!data ? onBlur : () => {}}
          onFocus={data ? onOpenModal : () => {}}
          autoCapitalize={autoCapitalized}
          defaultValue={defaultValue}
          value={value}
          multiline={multiline}
          returnKeyType={isLast ? 'done' : 'next'}
          textContentType={textContentType}
          keyboardType={keyboardType}
          left={affixLabel && <TextInput.Affix text={affixLabel} />}
          right={onInputRight}
          theme={
            data
              ? {
                  colors: {
                    text: primary,
                    disabled: placeholder,
                  },
                }
              : {}
          }
        />
        {error && error.message && (
          <HelperText type="error" visible={error && error.message}>
            {error && error.message}
          </HelperText>
        )}
        <AtomModalAddressInput
          show={showModal}
          title={label}
          dataList={data ? data : []}
          onClose={onCloseModal}
          onChange={onChange}
          onPress={onPress}
          fieldName={name}
          multiselect={multiselect}
          onSaveMultiselect={onSaveMultiselect}
        />
      </Section>
    );
  },
);

InputFieldComponent.propTypes = {
  // use to determined marginBottom
  isLast: PropTypes.bool,
  // use as the input label
  label: PropTypes.string.isRequired,
  // use as defaultValue
  defaultValue: PropTypes.string,
  // use to determined whether to show affix component or not
  affixLabel: PropTypes.string,
  //use as capitalized format for the input
  autoCapitalized: PropTypes.string,
  // use to determined whether to enable secureTextEntry and Visibility Password Component
  isPassword: PropTypes.bool,
  // use tas text content type of the Input
  textContentType: PropTypes.any,
  // use as keyboard type of the Input
  keyboardType: PropTypes.string,
  // use whether multiline enable or not
  multiline: PropTypes.bool,
  // use as callback function for onChange event
  onChange: PropTypes.func.isRequired,
  // use as callback function fot onBlur event
  onBlur: PropTypes.func.isRequired,
  // use as value of the input
  value: PropTypes.string.isRequired,
  //use to show error message
  error: PropTypes.object,
  //use for disabling input on submit
  isSubmitting: PropTypes.bool,
  //state for editable props
  editable: PropTypes.bool,
  // data list for dropdown input
  data: PropTypes.array,
  //onPress callback on selected item for dropdown input
  onPress: PropTypes.func,
  //name from the controller
  name: PropTypes.string,
  // loading state to use in submit
  loading: PropTypes.bool,
};

export default InputFieldComponent;
