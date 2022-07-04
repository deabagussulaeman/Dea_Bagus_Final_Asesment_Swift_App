import React, {createRef} from 'react';
import {useForm} from 'react-hook-form';
import {Controller} from 'react-hook-form';
import {Button, Caption} from 'react-native-paper';
import {modules} from '@root/swift.config';
import {navigateTo} from '@app/helpers/Navigation';
import {Colors} from '@app/styles';
import {FORM_FIELD, TYPE_INPUT_FIELD} from '@app/helpers/Constants';

import i18next from 'i18next';
import PropTypes from 'prop-types';
import Input from '@app/components/Input';
import CheckBox from '@app/components/CheckBox';
import Label from '@app/components/Label';
import styles from '@app/components/_Forms/views/tablet/styles';
import DatePicker from '@app/components/DatePicker';
import Section from '@app/components/Section';

/**
 * @component LabeledCheckbox - override CheckBox to add label after it
 * @param {Boolean} value - state of the checkbox
 * @param {Function} onChange - function for the onClick Checkbox
 * @param {Object} error - use to render error border on Checkbox
 * @param {String} label - use for label Checkbox
 * @param {Boolean} isLast - use to determine marginBottom of the Checkbox
 * @summary Only use in the Forms
 * @returns Component
 */
const LabeledCheckbox = ({
  value,
  onChange,
  onCloseModal,
  error,
  label,
  isLast,
  isTerms,
}) => {
  const renderCaption = () => {
    if (!isTerms) {
      return <Caption style={styles.label}>{label}</Caption>;
    }
    return (
      <Caption style={styles.label}>
        {i18next.t('main_home.label.terms.firstPhrase')}
        <Caption
          style={{color: Colors.PRIMARY, textDecorationLine: 'underline'}}
          onPress={() => {
            onCloseModal();
            navigateTo(modules.blank.enable, modules.blank.name);
          }}>
          {i18next.t('main_home.label.terms.secondPhrase')}
        </Caption>
      </Caption>
    );
  };

  const renderError = () => {
    if (error && error.message) {
      return (
        <Label small primary>
          {error.message}
        </Label>
      );
    }
  };

  return (
    <Section>
      <Section
        style={[isLast ? styles.containerCheckBottom : styles.containerCheck]}>
        <CheckBox
          uncheckedColor={error?.message && 'red'}
          onPress={() => onChange(!value)}
          size={20}
          selected={value}
        />
        {renderCaption()}
      </Section>
      {renderError()}
    </Section>
  );
};

/**
 * @component FormComponent
 * @param {Object} FormComponent.propTypes - defined using PropTypes
 * @summary Use to render formschema into component
 * @returns Components
 */
export const _onFormHandleSubmitRef = createRef();
export const _onFormHandleResetRef = createRef();
export const _onFormHandleValuesRef = createRef();
export const useFormConfig = {
  mode: 'onChange',
  criteriaMode: 'firstError',
  shouldFocusError: true,
  shouldUnregister: false,
};

const FormComponent = ({
  resetAfterSubmit = false,
  fields,
  onSubmit,
  onCloseModal,
  onError,
  loading,
  buttonTitle,
  useFormExternal,
}) => {
  const {control, handleSubmit, getValues, reset} = useFormExternal
    ? useFormExternal
    : useForm(useFormConfig);

  _onFormHandleSubmitRef.current = handleSubmit;
  _onFormHandleResetRef.current = reset;
  _onFormHandleValuesRef.current = getValues;

  const submitEvent = data => {
    onSubmit(data);
    resetAfterSubmit ? reset() : null;
  };

  const errorEvent = errors => {
    console.log('[dev] errors', errors);
    onError(errors);
  };

  return (
    <Section style={styles.container}>
      {fields.map((item, index) => {
        return item.type === FORM_FIELD.CUSTOM ? (
          item.renderItem
        ) : (
          <Controller
            key={item.name}
            name={item.name}
            control={control}
            defaultValue={item.defaultValue}
            rules={item.rules}
            render={({
              field: {onChange, onBlur, value, ref},
              fieldState: {error},
              formState: {isSubmitting},
            }) => {
              if (item.type === FORM_FIELD.CHECKBOX) {
                return (
                  <LabeledCheckbox
                    isLast={fields.length === index + 1}
                    isTerms={item.isTerms}
                    value={value}
                    onChange={onChange}
                    onCloseModal={onCloseModal}
                    error={error}
                    label={item.label}
                    containerStyle={item?.containerStyle}
                  />
                );
              }
              if (item.type === FORM_FIELD.INPUT) {
                return (
                  <Input
                    type={TYPE_INPUT_FIELD}
                    key={`form-fields-${item.name}-${index}`}
                    loading={loading}
                    isLast={fields.length === index + 1}
                    control={control}
                    defaultValue={item.defaultValue}
                    rules={item.rules}
                    name={item.name}
                    label={item.label}
                    affixLabel={item.affixLabel}
                    isPassword={item.isPassword}
                    autoCapitalized={item.autoCapitalized}
                    textContentType={item.textContentType}
                    keyboardType={item.keyboardType}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={error}
                    isSubmitting={isSubmitting}
                    innerRef={ref}
                  />
                );
              }
              if (item.type === FORM_FIELD.INPUT_DROPDOWN) {
                return (
                  <Section>
                    {item.isVisible ? (
                      <Input
                        type={TYPE_INPUT_FIELD}
                        key={`form-fields-${item.name}-${index}`}
                        isLast={fields.length === index + 1}
                        control={control}
                        data={item.data}
                        onPress={item.onPress}
                        defaultValue={item.defaultValue}
                        rules={item.rules}
                        name={item.name}
                        label={item.label}
                        affixLabel={item.affixLabel}
                        isPassword={item.isPassword}
                        autoCapitalized={item.autoCapitalized}
                        textContentType={item.textContentType}
                        keyboardType={item.keyboardType}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={error}
                        isSubmitting={isSubmitting}
                        innerRef={ref}
                        inputRightCustom={item.inputRightCustom}
                      />
                    ) : (
                      <></>
                    )}
                  </Section>
                );
              }
              if (item.type === FORM_FIELD.DATE) {
                return <DatePicker label={item.label} callback={onChange} />;
              }
              return <Label>Error</Label>;
            }}
          />
        );
      })}
      <Button
        loading={loading}
        style={styles.button}
        disabled={loading}
        mode={'contained'}
        onPress={handleSubmit(submitEvent, errorEvent)}>
        {buttonTitle}
      </Button>
    </Section>
  );
};

FormComponent.propTypes = {
  // use as schema to render form fields
  fields: PropTypes.array.isRequired,
  // use as a callback function for submit button
  onSubmit: PropTypes.func,
  // use as a callback function for close modal button
  onCloseModal: PropTypes.func,
  // use as a callback function for error from useForm
  onError: PropTypes.func,
  // use as loader state for submit button
  loading: PropTypes.bool,
  // use for button submit title
  buttonTitle: PropTypes.string,
};

export default FormComponent;
