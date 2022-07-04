import React from 'react';
import Views from '@app/_modules/account_myaccount/views';
import {useTranslation} from 'react-i18next';
import {modules} from '@root/swift.config';

const MyAccountController = props => {
  if (!modules.account_myaccount.enable) {
    return null;
  }
  const {t} = useTranslation();

  /**
   * [props] set controller props
   * @return {object}
   */
  const controllerProps = {
    t,
  };

  return <Views {...props} {...controllerProps} />;
};

export default MyAccountController;
