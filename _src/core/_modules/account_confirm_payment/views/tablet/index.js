import React from 'react';
import {SafeAreaView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {formSchema} from '@app/_modules/account_confirm_payment/forms';
import Forms from '@app/components/_Forms/index';
import NavBar from '@app/components/NavBar';
import {FORM_FIELD, TYPE_APPBAR} from '@app/helpers/Constants';
import ImagePicker from '@app/components/ImagePicker';
import PropTypes from 'prop-types';

import styles from '@app/_modules/account_confirm_payment/views/tablet/styles';
import {Mixins} from '@app/styles';

const imagePicker = ({t, onSelectImage}) => {
  return (
    <ImagePicker
      style={{width: Mixins.MAX_WIDTH * 0.75, fontSize: 10}}
      key={'upload-image'}
      label={t('account_confirm_payment.label.uploadImage')}
      callback={imageData => onSelectImage(imageData)}
    />
  );
};

const ConfirmPaymentTabletView = ({
  navigation,
  loading,
  onSubmit,
  onError,
  onSelectImage,
  t,
}) => {
  const forms = formSchema({
    custom: [
      {
        name: 'filename',
        type: FORM_FIELD.CUSTOM,
        renderItem: imagePicker({t, onSelectImage}),
      },
    ],
  });

  return (
    <SafeAreaView style={styles.container}>
      <NavBar
        type={TYPE_APPBAR}
        useBack
        title={t('account_confirm_payment.title.confirmPayment')}
      />
      <KeyboardAwareScrollView
        style={{
          width: Mixins.MAX_WIDTH * 0.75,
          marginTop: 20,
          alignSelf: 'center',
        }}>
        <Forms
          fields={forms}
          onSubmit={onSubmit}
          onError={onError}
          loading={loading}
          buttonTitle={t('account_confirm_payment.title.confirmPayment')}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

ConfirmPaymentTabletView.propTypes = {
  // navigation
  navigation: PropTypes.any,
  // shows loading
  loading: PropTypes.bool,
  // function for submit form
  onSubmit: PropTypes.func,
  // function for error in form
  onError: PropTypes.func,
  // function for render image
  onSelectImage: PropTypes.func,
  // use for displaying label from translation module
  t: PropTypes.func,
};

export default ConfirmPaymentTabletView;
