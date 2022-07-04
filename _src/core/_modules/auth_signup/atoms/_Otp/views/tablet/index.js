import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Feather';
import {Caption, Portal, Modal} from 'react-native-paper';
import Section from '@app/components/Section';
import Forms from '@app/components/_Forms/index';
import Label from '@app/components/Label';
import styles from '@app/_modules/auth_signup/atoms/_Otp/views/tablet/styles';

/**
 * @component AtomOtpSignUp
 * @param {type} AtomOtpComponent.propTypes
 * @summary Atom Component for Sign up OTP
 * @returns Components
 */
const AtomOtpComponent = ({
  t,
  fields,
  modalOtp,
  loading,
  onVerifyCreate,
  onCloseModal,
  phoneNumber,
}) => {
  return (
    <Portal>
      <Modal
        visible={modalOtp}
        dismissable={false}
        contentContainerStyle={styles.modalContainer}>
        <Icon
          name={'x'}
          size={30}
          style={styles.close}
          onPress={onCloseModal}
        />
        <Label style={styles.title}>{t('auth_signup.view.verifyPhone')}</Label>
        <Caption style={styles.caption}>
          {t('auth_signup.view.codeSent')} {phoneNumber}
        </Caption>

        <Forms
          fields={fields}
          buttonTitle={t('auth_signup.label.verifyAndCreate')}
          loading={loading}
          onSubmit={onVerifyCreate}
        />
        <Section row horizontalCenter verticalCenter>
          <Label style={styles.label}>
            {t('auth_signup.view.didntReceive')}{' '}
          </Label>
          <Section>
            <Label style={styles.labelBold}>
              {t('auth_signup.view.requestAgain')}
            </Label>
          </Section>
        </Section>
      </Modal>
    </Portal>
  );
};

AtomOtpComponent.propTypes = {
  // use for translation
  t: PropTypes.func.isRequired,
  // use for rendering Form Field
  fields: PropTypes.array.isRequired,
  //use for modal visibility state
  modalOtp: PropTypes.bool,
  //use for loader state
  loading: PropTypes.bool,
  // use for submit button onPress
  onVerifyCreate: PropTypes.func.isRequired,
  // use for closing modal
  onCloseModal: PropTypes.func.isRequired,
  // use for displaying phone number in modal
  phoneNumber: PropTypes.string.isRequired,
};

export default AtomOtpComponent;
