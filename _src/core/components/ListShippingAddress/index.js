import React from 'react';
import {
  TYPE_LIST_ADDRESS_ACCOUNT,
  TYPE_LIST_ADDRESS_CHECKOUT,
} from '@app/helpers/Constants';
import ListShippingAddressAccount from '@app/components/ListShippingAddress/atoms/ShippingAddressAccount/index';
import ListShippingAddressCheckout from '@app/components/ListShippingAddress/atoms/ShippingAddressCheckout/index';

const ListShippingAddress = props => {
  if (props?.type === TYPE_LIST_ADDRESS_ACCOUNT) {
    return <ListShippingAddressAccount {...props} />;
  }
  if (props?.type === TYPE_LIST_ADDRESS_CHECKOUT) {
    return <ListShippingAddressCheckout {...props} />;
  }
  return null;
};

export default ListShippingAddress;
