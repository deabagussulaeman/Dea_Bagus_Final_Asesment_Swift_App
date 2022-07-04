import {FORM_FIELD} from '@app/helpers/Constants';
import {useTranslation} from 'react-i18next';
import DateHelper from '@app/helpers/Date';
/**
 * @constant {Array} formSchema
 * @summary use as Sign in form fields
 */
export const formSchema = ({custom}) => {
  const {t} = useTranslation();
  return [
    {
      name: 'order_number',
      label: t('account_confirm_payment.label.orderNumber'),
      type: FORM_FIELD.INPUT,
      defaultValue: '',
      rules: {
        required: t('account_confirm_payment.required.orderNumber'),
      },
    },
    {
      name: 'payment_from',
      label: t('account_confirm_payment.label.bankNameFrom'),
      type: FORM_FIELD.INPUT,
      defaultValue: '',
      rules: {
        required: t('account_confirm_payment.required.bankNameFrom'),
      },
    },
    {
      name: 'payment_to',
      label: t('account_confirm_payment.label.bankNameTo'),
      type: FORM_FIELD.INPUT,
      defaultValue: '',
      rules: {
        required: t('account_confirm_payment.required.bankNameTo'),
      },
    },
    {
      name: 'account_number',
      label: t('account_confirm_payment.label.bankAccountNumber'),
      type: FORM_FIELD.INPUT,
      defaultValue: '',
      rules: {
        required: t('account_confirm_payment.required.bankAccountNumber'),
      },
    },
    {
      name: 'account_name',
      label: t('account_confirm_payment.label.bankAccountName'),
      type: FORM_FIELD.INPUT,
      defaultValue: '',
      rules: {
        required: t('account_confirm_payment.required.bankAccountName'),
      },
    },
    {
      name: 'amount',
      label: t('account_confirm_payment.label.amountTransfer'),
      type: FORM_FIELD.INPUT,
      defaultValue: '',
      rules: {
        required: t('account_confirm_payment.required.amountTransfer'),
      },
    },
    {
      name: 'date',
      label: t('account_confirm_payment.label.transferDate'),
      type: FORM_FIELD.DATE,
      defaultValue: DateHelper.convert(new Date(), '/', {reverse: true}), // date pay,
      rules: {
        required: t('account_confirm_payment.required.transferDate'),
      },
    },
    ...custom,
  ];
};
