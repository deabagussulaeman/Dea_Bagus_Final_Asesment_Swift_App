import React from 'react';
import {
  TYPE_MODAL_AUTH_SIGNIN,
  TYPE_MODAL_PAYMENT_SNAP,
  TYPE_MODAL_SHIPPING_ADDRESS_FORM,
  TYPE_MODAL_SHIPPING_ADDRESS_LIST,
  TYPE_MODAL_ADDRESS_INPUT,
  TYPE_MODAL_SORT,
} from '@app/helpers/Constants';

import AtomModalAuthSignin from '@app/components/_AppModal/atoms/ModalAuthSignin';
import AtomModalShippingAddressForm from '@app/components/_AppModal/atoms/ModalShippingAddressForm';
import AtomModalShippingAddressList from '@app/components/_AppModal/atoms/ModalShippingAddressList';
import AtomModalPaymentSnap from '@app/components/_AppModal/atoms/ModalPaymentSnap';
import AtomModalAddressInput from '@app/components/_AppModal/atoms/ModalAddressInput';
import AtomModalSort from '@app/components/_AppModal/atoms/ModalSort/index';

const AppModal = props => {
  if (props?.type === TYPE_MODAL_AUTH_SIGNIN) {
    return <AtomModalAuthSignin {...props} />;
  }
  if (props?.type === TYPE_MODAL_SHIPPING_ADDRESS_FORM) {
    return <AtomModalShippingAddressForm {...props} />;
  }
  if (props?.type === TYPE_MODAL_SHIPPING_ADDRESS_LIST) {
    return <AtomModalShippingAddressList {...props} />;
  }
  if (props?.type === TYPE_MODAL_PAYMENT_SNAP) {
    return <AtomModalPaymentSnap {...props} />;
  }
  if (props?.type === TYPE_MODAL_ADDRESS_INPUT) {
    return <AtomModalAddressInput {...props} />;
  }
  if (props?.type === TYPE_MODAL_SORT) {
    return <AtomModalSort {...props} />;
  }
  return null;
};

export default AppModal;
