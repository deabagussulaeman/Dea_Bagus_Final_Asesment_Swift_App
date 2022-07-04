import React, {useState} from 'react';
import useCustomMutation from '@app/hooks/useCustomMutation';
import {MUTATION_CONFIRM_PAYMENT} from '@app/_modules/account_confirm_payment/services/schema';
import {rxAppSnackbar} from '@app/services/cache';
import DateHelper from '@app/helpers/Date';
import {useTranslation} from 'react-i18next';
import {modules} from '@root/swift.config';
import PropTypes from 'prop-types';
import Views from '@app/_modules/account_confirm_payment/views';

const ConfirmPaymentController = props => {
  if (!modules.account_confirm_payment.enable) {
    return null;
  }

  /**
   * ---------------------------------------------------- *
   * @var {hooks}
   * ---------------------------------------------------- *
   */
  const {t} = useTranslation();
  const {onRefetchData: onPostConfirmPayment} = useCustomMutation({
    schema: MUTATION_CONFIRM_PAYMENT,
  });
  const [loading, setLoading] = useState(false);
  const [imageBase, setImageBase] = useState('');

  /**
   * ---------------------------------------------------- *
   * @function onSubmit
   * @summary on event request to server
   * ---------------------------------------------------- *
   */
  const onSubmit = async input => {
    const imageDate = DateHelper.convert(new Date());
    const filename =
      'confirm-payment-' + imageDate + input.order_number + '.jpg';
    const variables = {
      input: {
        order_number: input.order_number,
        account_name: input.account_name,
        account_number: input.account_number,
        amount: input.amount,
        date: input.date, // date pay
        filename: filename,
        image_base64: imageBase,
        payment_from: input.payment_from,
        payment_to: input.payment_to,
      },
    };
    setLoading(true);
    try {
      const res = await onPostConfirmPayment({
        params: variables,
        paramsOpt: {isReturn: true},
      });
      const success = res?.data.createConfirmPayment.success;
      if (success) {
        rxAppSnackbar({
          message: t('account_confirm_payment.message.successConfirmPayment'),
        });
        setLoading(false);
      }
      props.navigation.goBack();
    } catch (err) {
      setLoading(true);
      rxAppSnackbar({message: err.toString()});
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function onErrorSubmit
   * @summary on event for error in forms
   * ---------------------------------------------------- *
   */
  const onErrorSubmit = () => {
    rxAppSnackbar({message: t('account_confirm_payment.error.message')});
  };

  const onSelectImage = imageData => {
    const image_base64 = 'data:' + imageData.mime + ';base64,' + imageData.data;
    setImageBase(image_base64);
  };

  /**
   * ---------------------------------------------------- *
   * @constant {controllerProps}
   * @summary set controller props
   * ---------------------------------------------------- *
   */
  const controllerProps = {
    t,
    loading,
    onSelectImage,
    onError: onErrorSubmit,
    onSubmit: onSubmit,
  };

  return <Views {...props} {...controllerProps} />;
};

ConfirmPaymentController.propTypes = {
  //navigation
  navigation: PropTypes.any,
};

export default ConfirmPaymentController;
