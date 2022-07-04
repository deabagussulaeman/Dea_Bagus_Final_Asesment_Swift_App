import React, {useState} from 'react';
import useCustomMutation from '@app/hooks/useCustomMutation';
import useDataCustomer, {TYPES} from '@app/hooks/customer/useDataCustomer';
import {useTranslation} from 'react-i18next';
import {CHANGE_EMAIL} from '@app/_modules/account_change_email/services/schema';
import Views from '@app/_modules/account_change_email/views';
import {rxAppSnackbar} from '@app/services/cache';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';

/**
 * @component ChangeEmail
 * @param {Object} props
 * @summary Controller for update account screen
 */
const ChangeEmailController = props => {
  // render null on module false
  if (!modules.account_change_password.enable) {
    return null;
  }
  const {email} = props.route.params;
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const {setDataResponse} = useDataCustomer({initialized: false});
  const {onRefetchData: changeEmailHook} = useCustomMutation({
    schema: CHANGE_EMAIL,
  });

  /**
   * @function changeEmail
   * @param {Object} data - forms value {currentPassword, newPassword}
   * @summary function callback onSubmit event from
   * useForm to update password
   */
  const changeEmail = async data => {
    try {
      setLoading(true);
      if (data.email === email) {
        rxAppSnackbar({
          message: t('account_change_email.message.sameWithCurrentEmail'),
        });
        return setLoading(false);
      }
      const res = await changeEmailHook({
        params: {
          email: data.email,
          password: data.password,
        },
        paramsOpt: {isReturn: true},
      });
      if (res?.data) {
        setDataResponse(res?.data?.updateCustomer, TYPES.USER_INFO);
        setLoading(false);
        rxAppSnackbar({
          message: t('account_change_email.message.emailUpdated'),
        });
        navigateTo(modules.account.enable, modules.account.name);
      } else {
        throw res;
      }
    } catch (error) {
      setLoading(false);
      rxAppSnackbar({
        message: error.toString(),
      });
    }
  };

  const controllerProps = {
    t,
    loading,
    changeEmail,
  };

  return <Views {...props} {...controllerProps} />;
};

export default ChangeEmailController;
