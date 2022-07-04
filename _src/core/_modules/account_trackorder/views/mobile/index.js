import React from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native';
import {formSchema} from '@app/_modules/account_trackorder/forms';
import PropTypes from 'prop-types';
import NavBar from '@app/components/NavBar';
import Forms from '@app/components/_Forms/index';
import {TYPE_APPBAR} from '@app/helpers/Constants';

const AccountTrackOrderMobileView = ({loading, onPostData, onPostError}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView>
      <NavBar
        type={TYPE_APPBAR}
        useBack
        title={t('account_trackorder.title.trackOrder')}
      />
      <Forms
        fields={formSchema}
        onSubmit={onPostData}
        onError={onPostError}
        loading={loading}
        buttonTitle={t('account_trackorder.label.trackOrder')}
      />
    </SafeAreaView>
  );
};

AccountTrackOrderMobileView.propTypes = {
  // shows loading
  loading: PropTypes.bool,
  // function for submit form
  onPostData: PropTypes.func,
  // function for handle error
  onPostError: PropTypes.func,
};

export default AccountTrackOrderMobileView;
