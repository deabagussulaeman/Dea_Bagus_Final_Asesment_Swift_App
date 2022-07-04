import React from 'react';
import NavBar from '@app/components/NavBar';
import PropTypes from 'prop-types';
import {TYPE_APPBAR, TYPE_LIST_ADDRESS_ACCOUNT} from '@app/helpers/Constants';
import ListShippingAddress from '@app/components/ListShippingAddress';

const AccountMyAccountMobileView = ({t}) => {
  return (
    <>
      <NavBar
        type={TYPE_APPBAR}
        title={t('account_myaccount.title.savedAddress')}
        useBack
      />
      <ListShippingAddress type={TYPE_LIST_ADDRESS_ACCOUNT} />
    </>
  );
};

AccountMyAccountMobileView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
};

export default AccountMyAccountMobileView;
