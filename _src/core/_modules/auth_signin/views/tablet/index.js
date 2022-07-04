import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {ScrollView} from 'react-native';
import {Caption, TouchableRipple} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from 'react-native-paper';
import {formSchema} from '@app/_modules/auth_signin/forms';
import Section from '@app/components/Section';
import Forms from '@app/components/_Forms/index';
import NavBar from '@app/components/NavBar';
import Label from '@app/components/Label';
import styles from '@app/_modules/auth_signin/views/tablet/styles';
import {TYPE_APPBAR} from '@app/helpers/Constants';

/**
 * ---------------------------------------------------- *
 * @component AuthSigningView
 * @param {Object} Views.propTypes - defined using PropTypes
 * @summary View Component for Sign In
 * @returns Components
 * ---------------------------------------------------- *
 */

const AuthSignInTabletView = ({
  t,
  loading,
  onSignin,
  onError,
  onNavigateSignup,
}) => {
  const theme = useTheme();
  const {background} = _.get(theme, 'colors');

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: background}]}>
      <NavBar type={TYPE_APPBAR} useBack title={t('login.title')} />
      <ScrollView contentContainerStyle={styles.mainContainer}>
        <Label style={styles.title}>{t('login.titleScreen')}</Label>
        <Caption style={styles.caption}>{t('login.captionScreen')}</Caption>
        <Forms
          fields={formSchema}
          onSubmit={onSignin}
          onError={onError}
          loading={loading}
          buttonTitle={t('login.button')}
        />
        <Section style={styles.footerForm}>
          <Caption>{t('login.captionRegister')} </Caption>
          <TouchableRipple onPress={onNavigateSignup}>
            <Caption style={styles.btnSignup}>
              {t('login.buttonRegister')}
            </Caption>
          </TouchableRipple>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

AuthSignInTabletView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func.isRequired,
  // use to determined loading state
  loading: PropTypes.bool,
  // use as callback function on Submit
  onSignin: PropTypes.func.isRequired,
  // use as callback function for onError from the useForm
  onError: PropTypes.func,
  // use as callback on register touchable
  onNavigateSignup: PropTypes.func.isRequired,
};

export default AuthSignInTabletView;
