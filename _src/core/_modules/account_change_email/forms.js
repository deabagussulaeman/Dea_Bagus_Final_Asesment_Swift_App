/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
import {FORM_FIELD} from '@app/helpers/Constants';
import {useTranslation} from 'react-i18next';

/**
 * @constant {Array} formSchema
 * @summary use as Change email form fields
 */
const {t} = useTranslation();
export const formSchema = [
  {
    name: 'email',
    label: t('account_change_email.label.newEmail'),
    textContentType: 'emailAddress',
    type: FORM_FIELD.INPUT,
    defaultValue: '',
    keyboardType: 'email-address',
    rules: {
      required: t('account_change_email.required.newEmail'),
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: t('account_change_email.error.newEmail'),
      },
    },
  },
  {
    name: 'password',
    label: t('account_change_email.label.password'),
    textContentType: 'password',
    type: FORM_FIELD.INPUT,
    isPassword: true,
    defaultValue: '',
    rules: {
      required: 'Password required',
      pattern: {
        value:
          /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&\/=?_.,:;\\-])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&\/=?_.,:;\\-])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&\/=?_.,:;\\-])).{8,}$/,
        message: t('account_change_email.error.password'),
      },
    },
  },
];
