import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {rxAppSnackbar} from '@app/services/cache';
import PropTypes from 'prop-types';
import Views from '@app/_modules/account_update_information/views';
import {navigateTo} from '@app/helpers/Navigation';
import useCustomMutation from '@app/hooks/useCustomMutation';
import useDataCustomer, {TYPES} from '@app/hooks/customer/useDataCustomer';
import {UPDATE_ACCOUNT_INFORMATION} from '@app/_modules/account_update_information/services/schema';
import {formSchema} from '@app/_modules/account_update_information/forms';
import {modules} from '@root/swift.config';

/**
 * @component UpdateAccountInformation
 * @param {Object} navigation
 * @param {Object} route
 * @summary Controller for update account screen
 */
const UpdateInformationController = ({navigation, route}) => {
  if (!modules.account_update_information.enable) {
    return null;
  }
  const {t} = useTranslation();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountInformation, setAccountInformation] = useState(null);
  const {setDataResponse} = useDataCustomer({initialized: false});
  const {onRefetchData} = useCustomMutation({
    schema: UPDATE_ACCOUNT_INFORMATION,
  });

  useEffect(() => {
    if (route) {
      // Props from previous screen
      const {firstname, lastname} = route.params.accountInformationData;
      // Set default value to the form schema
      const formSchemaState = formSchema({
        firstName: firstname,
        lastName: lastname,
      });
      setForms(formSchemaState);
      setAccountInformation(route.params.accountInformationData);
    }
  }, [route]);

  /**
   * @function updateAccountInformation
   * @param {Object} data - forms value {firstName, lastName}
   * @summary function callback onSubmit event from
   * useForm to update user information
   */
  const updateAccountInformation = async data => {
    try {
      setLoading(true);
      const res = await onRefetchData({
        params: {
          firstname: data.firstName,
          lastname: data.lastName,
        },
        paramsOpt: {isReturn: true},
      });
      if (res) {
        setDataResponse(res?.data?.updateCustomer, TYPES.USER_INFO);
      }
      rxAppSnackbar({
        message: t('account_update_information.message.informationUpdated'),
      });
      setLoading(false);
      navigation.goBack();
    } catch (err) {
      rxAppSnackbar({message: err.toString()});
      setLoading(false);
    }
  };

  /**
   * @function onNavigateToChangePassword
   * @constant {Boolean} modules.account_change_password.enable
   * @constant {String} modules.account_change_password.name
   * @summary function callback to navigate to change password screen
   */
  const onNavigateToChangePassword = () =>
    navigateTo(
      modules.account_change_password.enable,
      modules.account_change_password.name,
    );

  /**
   * @function onNavigateToChangeEmail
   * @constant {Boolean} modules.account_change_email.enable
   * @constant {String} modules.account_change_email.name
   * @summary function callback to navigate to change email screen
   */
  const onNavigateToChangeEmail = () => {
    navigateTo(
      modules.account_change_email.enable,
      modules.account_change_email.name,
      {email: accountInformation?.email},
    );
  };

  const controllerProps = {
    t,
    loading,
    formSchema: forms,
    route,
    navigation,
    updateAccountInformation,
    onNavigateToChangePassword,
    onNavigateToChangeEmail,
  };

  return <Views {...controllerProps} />;
};

UpdateInformationController.propTypes = {
  // navigation
  navigation: PropTypes.any,
  // route
  route: PropTypes.any,
};

export default UpdateInformationController;
