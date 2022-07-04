import React, {useCallback, useEffect, useState} from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import useCustomMutation from '@app/hooks/useCustomMutation';
import {Storage} from '@app/helpers/Storage';
import {rxUserToken, rxUserType, rxAppSnackbar} from '@app/services/cache';
import {
  REGISTER,
  REQUEST_OTP,
  VERIFY_OTP,
} from '@app/_modules/auth_signup/services/schema';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import _ from 'lodash';
import {USER_CUSTOMER, USER_TYPE, BEARER, EMAIL} from '@app/helpers/Constants';
import Views from '@app/_modules/auth_signup/views';

/**
 * @controller AuthSignupController
 * @param {Object} props
 * @summary Controller for Sign Up
 */
const AuthSignUpController = props => {
  if (!modules.auth_signup.enable) {
    return null;
  }
  const withOTP = modules.auth_signup.atoms.otp.enable;

  const [dataReq, setDataReq] = useState({});
  const [modalOtp, setModalOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');

  const {onRefetchData: register} = useCustomMutation({schema: REGISTER});
  const {onRefetchData: requestOTP} = useCustomMutation({schema: REQUEST_OTP});
  const {onRefetchData: verifyOTP} = useCustomMutation({schema: VERIFY_OTP});

  /**
   * @function onRequestOTP
   * @param {Object} data Form fields
   * @summary Function to request an otp from phone number
   */
  const onRequestOTP = async data => {
    setPhone(data.phoneNumber);
    try {
      const res = await requestOTP({
        params: {
          phonenumber: `0${data.phoneNumber}`,
        },
        paramsOpt: {isReturn: true},
      });

      if (res) {
        setDataReq(data);
        setLoading(false);
        setModalOtp(true);
      }
    } catch (err) {
      setLoading(false);
      rxAppSnackbar({message: err.toString()});
    }
  };

  /**
   * @function onVerifyOTP
   * @summary Function to verifying OTP from User
   */
  const onVerifyOTP = async () => {
    try {
      const res = await verifyOTP({
        params: {
          otp: dataReq.otp,
          phonenumber: dataReq.phoneNumber,
        },
        paramsOpt: {isReturn: true},
      });

      if (res) {
        await onRegister();
      }
    } catch (err) {
      setLoading(false);
      rxAppSnackbar({message: err.toString()});
    }
  };

  /**
   * @function onRegister
   * @summary Function to Signing up user
   */
  const onRegister = async () => {
    const variables = _.get(dataReq, 'otp')
      ? {
          email: dataReq.email,
          password: dataReq.password,
          firstname: dataReq.firstName,
          lastname: dataReq.lastName,
          otp: dataReq.otp,
          phonenumber: `0${dataReq.phoneNumber}`,
          whatsappnumber: `0${dataReq.whatsappNumber}`,
        }
      : {
          email: dataReq.email,
          password: dataReq.password,
          firstname: dataReq.firstName,
          lastname: dataReq.lastName,
          phonenumber: `0${dataReq.phoneNumber}`,
          whatsappnumber: `0${dataReq.whatsappNumber}`,
        };

    try {
      const res = await register({
        params: variables,
        paramsOpt: {isReturn: true},
      });
      const USER_TOKEN = res.data.createCustomerCustom.token;
      Storage.set(Storage.name.USER_TYPE, USER_CUSTOMER);
      Storage.set(Storage.name.TOKEN, USER_TOKEN);
      rxUserToken(USER_TOKEN);
      rxUserType(USER_CUSTOMER);
      crashlytics().setAttribute(BEARER, USER_TOKEN);
      crashlytics().setAttribute(USER_TYPE, USER_CUSTOMER);
      crashlytics().setAttribute(EMAIL, dataReq.email);

      if (USER_TOKEN) {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      rxAppSnackbar({message: err.toString()});
    }
  };

  /**
   * @summary effect on dataReq states changes
   * determined which function need to execute later
   * based on dataReq state
   */
  useEffect(() => {
    if (!withOTP && !_.isEmpty(dataReq)) {
      onRegister();
    }
    if (withOTP && _.get(dataReq, 'otp')) {
      onVerifyOTP();
    }
  }, [dataReq]);

  /**
   * @function onSubmit
   * @param {Object} data - Fields from useForm
   * @summary Function callback for handleSubmit from useForm
   */
  const onSubmit = useCallback(
    async data => {
      if (!withOTP) {
        setLoading(true);
        setDataReq(data);
      }
      if (withOTP) {
        setLoading(true);
        await onRequestOTP(data);
      }
    },
    [withOTP],
  );
  
  // start edit script for asesment task (author: Dea Bagus Sulaeman)
    const alertFunct = () => {
      alert('Kamu ga boleh register');
    };
  // end edit script for asesment task (author: Dea Bagus Sulaeman)

  /**
   * @function onVerifyCreate
   * @param {Object} data - Fields from useForm
   * @summary Function callback for handleSubmit
   * from useForm if module OTP enabled
   */
  const onVerifyCreate = useCallback(
    async data => {
      if (!_.isEmpty(dataReq)) {
        setDataReq({...dataReq, ...data});
      }
    },
    [dataReq],
  );

  /**
   * @function onCloseModal
   * @summary Function callback on close button modal OTP
   */
  const onCloseModal = useCallback(() => {
    if (dataReq.otp) {
      setDataReq({...dataReq, otp: null});
      setModalOtp(false);
    }
    setModalOtp(false);
  }, []);

  /**
   * @function onNavigateSignIn
   * @summary Function callback for button login
   * @returns navigate to sign in screen
   */
  const onNavigateSignIn = () => {
    navigateTo(modules.auth_signin.enable, modules.auth_signin.name);
  };

  const controllerProps = {
    loading,
    modalOtp,
    isOtpEnabled: withOTP,
    phoneNumber: phone,
    onSubmit,
    onVerifyCreate,
    setModalOtp,
    onCloseModal,
    onNavigateSignIn,
    alertFunct,
  };

  return <Views {...props} {...controllerProps} />;
};

export default AuthSignUpController;
