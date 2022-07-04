import React from 'react';
import {useTranslation} from 'react-i18next';
import {Storage} from '@app/helpers/Storage';
import {navigateTo} from '@app/helpers/Navigation';
import {USER_GUEST, USER_TYPE} from '@app/helpers/Constants';
import {rxUserType} from '@app/services/cache';
import {modules, tabsApp} from '@root/swift.config';
import useNavAuthInitialize from '@app/hooks/_useNavAuthInitialize';
import crashlytics from '@react-native-firebase/crashlytics';
import Views from '@app/_modules/auth_landing/views';

const AuthLandingController = props => {
  if (!modules.auth_landing.enable) {
    return null;
  }

  /**
   * ---------------------------------------------------- *
   * @function useNavAuthInitialize
   * @summary this use for initialize top of stack auth
   * ---------------------------------------------------- *
   */
  useNavAuthInitialize();

  /**
   * ---------------------------------------------------- *
   * @constant controllerProps
   * @summary collections constant for
   * this contorller
   * ---------------------------------------------------- *
   */
  const {t} = useTranslation();

  /**
   * ---------------------------------------------------- *
   * @function onSkip
   * @summary on skip when user guest
   * ---------------------------------------------------- *
   */
  const onSkip = () => {
    rxUserType(USER_GUEST);
    crashlytics().setAttribute(USER_TYPE, USER_GUEST);
    Storage.set(Storage.name.USER_TYPE, USER_GUEST);
    navigateTo(tabsApp.name, tabsApp.name);
  };

  const controllerProps = {
    t,
    onSkip,
  };

  return <Views {...props} {...controllerProps} />;
};

export default AuthLandingController;
