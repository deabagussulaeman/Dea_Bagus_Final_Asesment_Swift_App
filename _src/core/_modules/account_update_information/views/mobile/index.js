import React from 'react';
import {SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import {Caption, TouchableRipple} from 'react-native-paper';
import {modules} from '@root/swift.config';
import styles from '@app/_modules/account_update_information/views/mobile/styles';
import NavBar from '@app/components/NavBar';
import Section from '@app/components/Section';
import FormComponent from '@app/components/_Forms/index';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TYPE_APPBAR} from '@app/helpers/Constants';

/**
 * @component UpdateAccountInformationView
 * @function FunctionName
 * @param {Object} Views.propTypes - defined on prop types
 * @summary Stateless Component for UpdateAccountInformation
 * @returns Components
 */

const AccountUpdateInformationMobileView = ({
  t,
  loading,
  formSchema,
  updateAccountInformation,
  onNavigateToChangePassword,
  onNavigateToChangeEmail,
}) => {
  // Will render nothing when update account disable
  if (!modules.account_update_information.enable) {
    return null;
  }

  return (
    <SafeAreaView>
      <NavBar
        type={TYPE_APPBAR}
        useBack
        title={t('account_update_information.title.accountInformation')}
      />
      <KeyboardAwareScrollView style={styles.subContainer}>
        <FormComponent
          loading={loading}
          fields={formSchema}
          buttonTitle={t('account_update_information.label.save')}
          onSubmit={updateAccountInformation}
        />
        <Section style={styles.footerContainer}>
          <TouchableRipple
            style={styles.footer}
            onPress={onNavigateToChangePassword}>
            <Caption style={styles.labelBold}>
              {t('account_update_information.label.changePassword')}
            </Caption>
          </TouchableRipple>
          <TouchableRipple
            style={styles.footer}
            onPress={onNavigateToChangeEmail}>
            <Caption style={styles.labelBold}>
              {t('account_update_information.label.changeEmail')}
            </Caption>
          </TouchableRipple>
        </Section>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

AccountUpdateInformationMobileView.propTypes = {
  // translation for any labels
  t: PropTypes.func,
  //  loading state to disable/enable submit button
  loading: PropTypes.bool.isRequired,
  // form scheme fields for Forms
  formSchema: PropTypes.array.isRequired,
  // function callback onsubmit for Forms
  updateAccountInformation: PropTypes.func.isRequired,
  // function callback for button change password
  onNavigateToChangePassword: PropTypes.func,
};

export default AccountUpdateInformationMobileView;
