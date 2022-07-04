import {FORM_FIELD} from '@app/helpers/Constants';
import i18next from 'i18next';
import {guestCheckout} from '@root/swift.config';

/**
 * @constant {Array} formSchema
 * @summary use as Add Address form fields
 */
export const formSchema = ({custom, defVal, isGuest}) => {
  let formSchemaDefault = [
    {
      name: 'firstName',
      label: i18next.t('cart_checkout.label.firstName'),
      type: FORM_FIELD.INPUT,
      defaultValue: defVal.firstName,
      autoCapitalized: 'words',
      textContentType: 'givenName',
      rules: {required: i18next.t('formError.required.firstName')},
    },
    {
      name: 'lastName',
      label: i18next.t('cart_checkout.label.lastName'),
      textContentType: 'familyName',
      type: FORM_FIELD.INPUT,
      defaultValue: defVal.lastName,
      autoCapitalized: 'words',
      rules: {required: i18next.t('formError.required.lastName')},
    },
    /**
   {
     name: 'middleName',
     label: `${i18next.t('cart_checkout.label.middleName')} (${i18next.t(
       'optional',
     )})`,
     textContentType: 'givenName',
     type: FORM_FIELD.INPUT,
     defaultValue: defVal ? defVal.middlename : '',
     autoCapitalized: 'words',
   },
   */
  ];

  if (guestCheckout.enable && isGuest) {
    formSchemaDefault = [
      {
        name: 'email',
        label: 'Email',
        textContentType: 'emailAddress',
        type: FORM_FIELD.INPUT,
        isVisible: isGuest,
        defaultValue: defVal ? defVal.email : '',
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        styleProp: {marginBottom: 0},
        formInputInfo: i18next.t('cart.setPasswordGuestCheckout'),
        rules: {
          required: i18next.t('formError.required.email'),
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: i18next.t('formError.valid.email'),
          },
        },
      },
      ...formSchemaDefault,
    ];
  }

  return [...formSchemaDefault, ...custom];
};
