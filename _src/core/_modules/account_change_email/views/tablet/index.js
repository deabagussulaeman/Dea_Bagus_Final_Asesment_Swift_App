import React from 'react';
import {SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import NavBar from '@app/components/NavBar';
import {formSchema} from '@app/_modules/account_change_email/forms';
import FormComponent from '@app/components/_Forms/index';
import styles from '@app/_modules/account_change_email/views/tablet/styles';
import {TYPE_APPBAR} from '@app/helpers/Constants';

/**
 * @component ChangeEmailTabletView
 * @param {Object} Views.propTypes - defined on prop types
 * @constant {Array} formSchema
 * @summary Stateless  view for change password screen
 * @returns Components
 */
const ChangeEmailTabletView = ({t, loading, changeEmail}) => {
  return (
    <SafeAreaView>
      <NavBar
        type={TYPE_APPBAR}
        useBack
        title={t('account_change_email.title.changeEmail')}
      />
      <KeyboardAwareScrollView style={styles.subContainer}>
        <FormComponent
          loading={loading}
          fields={formSchema}
          buttonTitle={t('account_change_email.title.changeEmail')}
          onSubmit={changeEmail}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

ChangeEmailTabletView.propTypes = {
  //translation for any labels
  t: PropTypes.func,
  // loading state for button in form
  loading: PropTypes.bool,
  //onSubmit callback to use in form
  changeEmail: PropTypes.func.isRequired,
};

export default ChangeEmailTabletView;
