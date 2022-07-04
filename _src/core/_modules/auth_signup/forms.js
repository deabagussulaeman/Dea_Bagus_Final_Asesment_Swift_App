/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
import {FORM_FIELD} from '@app/helpers/Constants';
import i18next from 'i18next';

/**
 * @constant {Array} formSchema
 * @summary use as Sign up OTP module form fields
 */
export const formSchemaOtp = [
  {
    name: 'otp',
    label: i18next.t('auth_signup.label.verificationCode'),
    textContentType: 'oneTimeCode',
    keyboardType: 'number-pad',
    type: 'Input',
    defaultValue: '',
    rules: {required: i18next.t('auth_signup.required.required')},
  },
];

/**
 * @constant {Array} formSchema
 * @summary use as Sign up form fields
 */
export const formSchema = [
  {
    name: 'email',
    label: i18next.t('auth_signup.label.email'),
    textContentType: 'emailAddress',
    type: FORM_FIELD.INPUT,
    defaultValue: '',
    keyboardType: 'email-address',
    rules: {
      required: i18next.t('auth_signup.required.email'),
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: i18next.t('auth_signup.error.email'),
      },
    },
  },
  {
    name: 'firstName',
    label: i18next.t('auth_signup.label.firstName'),
    type: FORM_FIELD.INPUT,
    defaultValue: '',
    autoCapitalized: 'words',
    textContentType: 'givenName',
    rules: {required: i18next.t('auth_signup.required.required')},
  },
  {
    name: 'lastName',
    label: i18next.t('auth_signup.label.lastName'),
    textContentType: 'familyName',
    type: 'Input',
    defaultValue: '',
    autoCapitalized: 'words',
    rules: {required: i18next.t('auth_signup.required.required')},
  },
  {
    name: 'password',
    label: i18next.t('auth_signup.label.password'),
    textContentType: 'password',
    type: FORM_FIELD.INPUT,
    isPassword: true,
    defaultValue: '',
    rules: {
      required: i18next.t('auth_signup.required.password'),
      pattern: {
        value:
          /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&\/=?_.,:;\\-])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&\/=?_.,:;\\-])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&\/=?_.,:;\\-])).{8,}$/,
        message: i18next.t('auth_signup.error.password'),
      },
    },
  },
  {
    name: 'phoneNumber',
    label: i18next.t('auth_signup.label.phoneNumber'),
    textContentType: 'telephoneNumber',
    keyboardType: 'phone-pad',
    type: FORM_FIELD.INPUT,
    defaultValue: '',
    affixLabel: '+62',
    rules: {required: i18next.t('auth_signup.required.required')},
  },
  {
    name: 'whatsappNumber',
    label: i18next.t('auth_signup.label.whatsappNumber'),
    textContentType: 'telephoneNumber',
    keyboardType: 'phone-pad',
    type: FORM_FIELD.INPUT,
    defaultValue: '',
    affixLabel: '+62',
    rules: {required: i18next.t('auth_signup.required.required')},
  },
  {
    name: 'terms',
    label: i18next.t('auth_signup.label.terms'),
    type: FORM_FIELD.CHECKBOX,
    defaultValue: false,
    rules: {required: i18next.t('auth_signup.required.required')},
  },
];
