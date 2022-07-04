import {FORM_FIELD} from '@app/helpers/Constants';
import i18next from 'i18next';

/**
 * @constant {Array} formSchema
 * @summary use as Newsletter subscription form fields
 */
export const formSchema = [
  {
    name: 'email',
    label: i18next.t('main_home.label.email'),
    textContentType: 'emailAddress',
    type: FORM_FIELD.INPUT,
    defaultValue: '',
    keyboardType: 'email-address',
    rules: {
      required: i18next.t('main_home.required.email'),
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: i18next.t('main_home.error.email'),
      },
    },
  },
  {
    name: 'terms',
    type: FORM_FIELD.CHECKBOX,
    isLast: true,
    isTerms: true,
    defaultValue: false,
    rules: {required: 'required'},
    containerStyle: {
      paddingVertical: 10,
    },
  },
];
