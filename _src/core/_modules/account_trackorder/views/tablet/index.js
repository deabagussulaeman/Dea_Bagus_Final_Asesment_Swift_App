import React from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native';
import {formSchema} from '@app/_modules/account_trackorder/forms';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import NavBar from '@app/components/NavBar';
import Forms from '@app/components/_Forms/index';
import {TYPE_APPBAR} from '@app/helpers/Constants';
import {Mixins} from '@root/_src/core/styles/index';

const AccountTrackOrderTabletView = ({loading, onPostData, onPostError}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView>
      <NavBar
        type={TYPE_APPBAR}
        useBack
        title={t('account_trackorder.title.trackOrder')}
      />
      <KeyboardAwareScrollView
        style={{
          marginTop: 20,
          width: Mixins.MAX_WIDTH * 0.75,
          alignSelf: 'center',
        }}>
        <Forms
          fields={formSchema}
          onSubmit={onPostData}
          onError={onPostError}
          loading={loading}
          buttonTitle={t('account_trackorder.label.trackOrder')}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

AccountTrackOrderTabletView.propTypes = {
  // shows loading
  loading: PropTypes.bool,
  // function for submit form
  onPostData: PropTypes.func,
  // function for handle error
  onPostError: PropTypes.func,
};

export default AccountTrackOrderTabletView;
