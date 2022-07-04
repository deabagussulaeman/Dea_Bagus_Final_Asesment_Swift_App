import {FORM_FIELD} from '@app/helpers/Constants';
import {useTranslation} from 'react-i18next';

/**
 * @constant {Array} formSchema
 * @summary use as Add Address form fields
 */
export const formSchema = ({custom, defVal}) => {
  const {t} = useTranslation();
  return [
    {
      name: 'firstName',
      label: t('account_add_address.label.firstName'),
      type: FORM_FIELD.INPUT,
      defaultValue: defVal ? defVal.firstname : '',
      autoCapitalized: 'words',
      textContentType: 'givenName',
      rules: {required: 'Required'},
    },
    {
      name: 'lastName',
      label: t('account_add_address.label.lastName'),
      textContentType: 'familyName',
      type: FORM_FIELD.INPUT,
      defaultValue: defVal ? defVal.lastname : '',
      autoCapitalized: 'words',
      rules: {required: 'Required'},
    },
    {
      name: 'phoneNumber',
      label: t('account_add_address.label.phoneNumber'),
      textContentType: 'telephoneNumber',
      keyboardType: 'phone-pad',
      type: FORM_FIELD.INPUT,
      defaultValue: defVal ? defVal.telephone : '',
      affixLabel: '+62',
      rules: {required: 'Required'},
    },
    ...custom,
    {
      name: 'defaultBilling',
      label: t('account_add_address.label.defaultBillingAddress'),
      type: FORM_FIELD.CHECKBOX,
      defaultValue: defVal ? defVal.default_billing : false,
      rules: {},
    },
    {
      name: 'defaultShipping',
      label: t('account_add_address.label.defaultShippingAddress'),
      type: FORM_FIELD.CHECKBOX,
      defaultValue: defVal ? defVal.default_shipping : false,
      rules: {},
    },
  ];
};
