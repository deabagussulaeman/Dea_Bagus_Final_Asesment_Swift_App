import React from 'react';
import {SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import NavBar from '@app/components/NavBar';
import {formSchema} from '@app/_modules/account_change_password/forms';
import FormComponent from '@app/components/_Forms/index';

import styles from '@app/_modules/account_change_password/views/tablet/styles';
import {TYPE_APPBAR} from '@app/helpers/Constants';

/**
 * @component ChangePasswordTabletView
 * @param {Object} Views.propTypes - defined on prop types
 * @constant {Array} formSchema
 * @summary Stateless  view for change password screen
 * @returns Components
 */
const ChangePasswordTabletView = ({t, loading, changePassword}) => {
  return (
    <SafeAreaView>
      <NavBar
        type={TYPE_APPBAR}
        useBack
        title={t('account_change_password.title.changePassword')}
      />
      <KeyboardAwareScrollView style={styles.subContainer}>
        <FormComponent
          loading={loading}
          fields={formSchema}
          buttonTitle={t('account_change_password.title.changePassword')}
          onSubmit={changePassword}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

ChangePasswordTabletView.propTypes = {
  //translation for any labels
  t: PropTypes.func,
  // loading state for button in form
  loading: PropTypes.bool,
  //onSubmit callback to use in form
  changePassword: PropTypes.func.isRequired,
};

export default ChangePasswordTabletView;
