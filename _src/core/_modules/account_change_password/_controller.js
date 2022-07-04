import React, {useState} from 'react';
import useCustomMutation from '@app/hooks/useCustomMutation';
import {useTranslation} from 'react-i18next';
import {CHANGE_PASSWORD} from '@app/_modules/account_change_password/services/schema';
import Views from '@app/_modules/account_change_password/views';

import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';

/**
 * @component ChangePassword
 * @param {Object} props
 * @summary Controller for update account screen
 */
const ChangePasswordController = props => {
  // render null on module false
  if (!modules.account_change_password.enable) {
    return null;
  }
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const {onRefetchData: changePasswordHook} = useCustomMutation({
    schema: CHANGE_PASSWORD,
  });

  /**
   * @function changePassword
   * @param {Object} data - forms value {currentPassword, newPassword}
   * @summary function callback onSubmit event from
   * useForm to update password
   */
  const changePassword = async data => {
    try {
      setLoading(true);
      await changePasswordHook({
        params: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        paramsOpt: {isReturn: true},
      });
      setLoading(false);
      navigateTo(
        modules.account_myaccount.enable,
        modules.account_myaccount.name,
      );
    } catch (error) {
      setLoading(false);
    }
  };

  const controllerProps = {
    t,
    loading,
    changePassword,
  };

  return <Views {...props} {...controllerProps} />;
};

export default ChangePasswordController;
