import {FORM_FIELD} from '@app/helpers/Constants';
import i18next from 'i18next';

/**
 * @constant {Array} formSchema
 * @summary use as Sign in form fields
 */
export const formSchema = [
  {
    name: 'email',
    label: i18next.t('account_trackorder.label.email'),
    textContentType: 'emailAddress',
    type: FORM_FIELD.INPUT,
    defaultValue: '',
    keyboardType: 'email-address',
    rules: {
      required: 'Email required',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: i18next.t('account_trackorder.error.message'),
      },
    },
  },
  {
    name: 'order_number',
    label: i18next.t('account_trackorder.label.trackOrder'),
    type: FORM_FIELD.INPUT,
    defaultValue: '',
    rules: {
      required: i18next.t('account_trackorder.required.trackOrder'),
    },
  },
];
