import React from 'react';
import {useReactiveVar} from '@apollo/client';
import {modules} from '@root/swift.config';
import {USER_GUEST} from '@app/helpers/Constants';
import {navReset} from '@app/helpers/Navigation';
import {navigateTo} from '@app/helpers/Navigation';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import ViewLogin from '@app/_modules/auth_signin/_controller';
import Views from '@app/_modules/account/views';
import {onSessionExpired} from '@app/hooks/customer/useDataCustomer';
import {rxUserType, rxUserInformation} from '@app/services/cache';

const AccountController = ({navigation}) => {
  if (!modules.account.enable) {
    return null;
  }
  /**
   * ---------------------------------------------------- *
   * @constant controllerProps
   * @summary collections constant for
   * this contorller
   * ---------------------------------------------------- *
   */
  const getRxUserInformation = useReactiveVar(rxUserInformation);
  const getRxUserType = useReactiveVar(rxUserType);
  const {t} = useTranslation();

  /**
   * ---------------------------------------------------- *
   * @function onLogOut
   * @summary clear all client and local storage
   * ---------------------------------------------------- *
   */
  const onLogOut = async () => {
    try {
      onSessionExpired();
      navReset(modules.auth_landing.name, {withDispatch: true});
    } catch (err) {
      console.log('[err] logout', err);
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function onEditProfile
   * @summary navigate to edit profile
   * ---------------------------------------------------- *
   */
  const onEditProfile = () => {
    navigateTo(
      modules.account_update_information.enable,
      modules.account_update_information.name,
      {accountInformationData: getRxUserInformation},
    );
  };

  /**
   * ---------------------------------------------------- *
   * @function onNavigateMenuPage
   * @param {object} item
   * @summary on navigate to each menu page
   * ---------------------------------------------------- *
   */
  const onNavigateMenuPage = item => {
    navigateTo(item.enable, item.moduleName);
  };

  if (getRxUserType === USER_GUEST) {
    return <ViewLogin />;
  }

  const controllerProps = {
    t,
    navigation,
    userData: getRxUserInformation,
    onLogOut,
    onEditProfile,
    onNavigateMenuPage,
  };

  return <Views {...controllerProps} />;
};

AccountController.propTypes = {
  // navigation
  navigation: PropTypes.any,
};

export default AccountController;
