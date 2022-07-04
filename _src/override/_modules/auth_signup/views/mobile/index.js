import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Caption, TouchableRipple} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Label from '@app/components/Label';
import Otp from '@app/_modules/auth_signup/atoms/_Otp';
import NavBar from '@app/components/NavBar';
import Section from '@app/components/Section';
import styles from '@app/_modules/auth_signup/views/mobile/styles';
import Forms from '@app/components/_Forms/index';
import {formSchema, formSchemaOtp} from '@app/_modules/auth_signup/forms';
import {TYPE_APPBAR} from '@app/helpers/Constants';

/**
 * @component AuthSignupView
 * @param {Object} Views.propTypes - defined using PropTypes
 * @summary View Component for Sign Up
 * @returns Components
 */
const AuthSignUpMobileView = ({
  isOtpEnabled,
  loading,
  modalOtp,
  onVerifyCreate,
  phoneNumber,
  onCloseModal,
  onNavigateSignIn,
  alertFunct,
}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView>
      {/* start edit script for asesment task (author: Dea Bagus Sulaeman) */}
        <NavBar type={TYPE_APPBAR} useBack title={t('auth_signup.register.title')} />
      {/* end edit script for asesment task (author: Dea Bagus Sulaeman) */}

      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
        <Label style={styles.title}>{t('login.titleScreen')}</Label>
        <Caption style={styles.caption}>{t('login.captionScreen')}</Caption>
        
        {/* start edit script for asesment task (author: Dea Bagus Sulaeman) */}
          <Forms
            fields={formSchema}
            buttonTitle={t('register.button')}
            loading={loading}
            onSubmit={alertFunct}
            customButtonStyle={styles}
          />
        {/* end edit script for asesment task (author: Dea Bagus Sulaeman) */}

        {isOtpEnabled && (
          <Otp
            t={t}
            fields={formSchemaOtp}
            modalOtp={modalOtp}
            loading={loading}
            onVerifyCreate={onVerifyCreate}
            onCloseModal={onCloseModal}
            phoneNumber={phoneNumber}
          />
        )}

        <Section style={styles.footerForm}>
          <Caption>{t('auth_signup.view.haveAnAccount')} </Caption>
          <TouchableRipple onPress={onNavigateSignIn}>
            <Caption style={styles.labelBold}>
              {t('auth_signup.view.loginHere')}
            </Caption>
          </TouchableRipple>
        </Section>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

AuthSignUpMobileView.propTypes = {
  // use to determined is module otp enabled
  isOtpEnabled: PropTypes.bool.isRequired,
  //  loading state to disable/enable submit button
  loading: PropTypes.bool.isRequired,
  // use to determined modal visibility
  modalOtp: PropTypes.bool,
  // used as a callback function for submit button
  onSubmit: PropTypes.func.isRequired,
  // used as a callback function on verify otp button
  onVerifyCreate: PropTypes.func,
  // used to display phone number on modal otp
  phoneNumber: PropTypes.string,
  // used to close the otp modal
  onCloseModal: PropTypes.func,
  // use as a callback on button login
  onNavigateSignIn: PropTypes.func.isRequired,
};

export default AuthSignUpMobileView;
