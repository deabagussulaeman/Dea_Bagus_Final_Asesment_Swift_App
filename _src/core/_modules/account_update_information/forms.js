import {FORM_FIELD} from '@app/helpers/Constants';
import i18next from 'i18next';

/**
 * @constant {Array} formSchema
 * @summary use as Sign in form fields
 */
export const formSchema = ({firstName, lastName}) => [
  {
    name: 'firstName',
    label: i18next.t('account_update_information.label.firstName'),
    type: FORM_FIELD.INPUT,
    defaultValue: firstName || '',
    autoCapitalized: 'words',
    textContentType: 'givenName',
    rules: {
      required: i18next.t('account_update_information.required.required'),
    },
  },
  {
    name: 'lastName',
    label: i18next.t('account_update_information.label.lastName'),
    textContentType: 'familyName',
    type: 'Input',
    defaultValue: lastName || '',
    autoCapitalized: 'words',
    rules: {
      required: i18next.t('account_update_information.required.required'),
    },
  },
];
