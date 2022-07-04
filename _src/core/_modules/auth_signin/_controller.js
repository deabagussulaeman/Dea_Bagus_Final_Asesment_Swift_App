import React, {useEffect, useRef, useState} from 'react';
import useCustomMutation from '@app/hooks/useCustomMutation';
import {useTranslation} from 'react-i18next';
import {Storage} from '@app/helpers/Storage';
import {
  rxUserType,
  rxUserToken,
  rxAppSnackbar,
  rxCartInitLoading,
} from '@app/services/cache';
import {LOGIN} from '@app/_modules/auth_signin/services/schema';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import {USER_CUSTOMER, USER_TYPE, BEARER, EMAIL} from '@app/helpers/Constants';
import crashlytics from '@react-native-firebase/crashlytics';
import Views from '@app/_modules/auth_signin/views';

const AuthSigninController = props => {
  if (!modules.auth_signin.enable) {
    return null;
  }

  /**
   * ---------------------------------------------------- *
   * @var {hooks}
   * ---------------------------------------------------- *
   */
  const {t} = useTranslation();
  const {onRefetchData: onPostSignin} = useCustomMutation({schema: LOGIN});
  const [loading, setLoading] = useState(false);
  const mount = useRef();

  /**
   * ---------------------------------------------------- *
   * @dependency []
   * @summary {lifecycle}
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    mount.current = true;
    return () => {
      mount.current = false;
    };
  }, []);

  /**
   * ---------------------------------------------------- *
   * @function onSubmit
   * @summary on event request to server
   * ---------------------------------------------------- *
   */
  const onSubmit = async data => {
    setLoading(true);
    const variables = {
      userLogin: data.email,
      password: data.password,
    };
    try {
      const res = await onPostSignin({
        params: variables,
        paramsOpt: {isReturn: true},
      });

      if (res.data) {
        rxCartInitLoading(true);
        const USER_TOKEN = res?.data?.generateCustomerTokenCustom?.token;
        Storage.set(Storage.name.TOKEN, USER_TOKEN);
        Storage.set(Storage.name.USER_TYPE, USER_CUSTOMER);
        rxUserToken(USER_TOKEN);
        rxUserType(USER_CUSTOMER);
        crashlytics().setAttribute(BEARER, USER_TOKEN);
        crashlytics().setAttribute(USER_TYPE, USER_CUSTOMER);
        crashlytics().setAttribute(EMAIL, data.email);
        // updateCartId();
      } else {
        rxAppSnackbar({message: res.toString(), duration: 7000});
      }

      if (mount.current) {
        setLoading(false);
      }
    } catch (err) {
      rxAppSnackbar({message: err.toString()});
      if (mount.current) {
        setLoading(false);
      }
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

  /**
   * ---------------------------------------------------- *
   * @function onNavigateSignup
   * @summary navigation to sign up page
   * ---------------------------------------------------- *
   */
  const onNavigateSignup = () => {
    navigateTo(modules.auth_signup.enable, modules.auth_signup.name);
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
    onSignin: onSubmit,
    onError: onErrorSubmit,
    onNavigateSignup,
  };

  return <Views {...props} {...controllerProps} />;
};

export default AuthSigninController;
