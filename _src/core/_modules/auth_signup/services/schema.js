import gql from 'graphql-tag';
import {filterGraphql} from '@app/services/helper';

export const REGISTER = gql(
  filterGraphql(`
  mutation createCustomerCustom(
    $email: String
    $password: String
    $firstname: String
    $lastname: String
    $otp: String
    $phonenumber: String
    $whatsappnumber: String
  ) {
    createCustomerCustom(
      input: {
        email: $email
        password: $password
        firstname: $firstname
        lastname: $lastname
        phonenumber: $phonenumber
        whatsapp_number: $whatsappnumber
        otp: $otp
      }
    ) {
      token
    }
  }
`),
);

export const REQUEST_OTP = gql(
  filterGraphql(`
  mutation requestOtpRegister($phonenumber: String!) {
    requestOtpRegister(phonenumber: $phonenumber) {
      info
    }
  }
`),
);

export const VERIFY_OTP = gql(
  filterGraphql(`
  mutation checkOtpRegister($phonenumber: String!, $otp: String!) {
    checkOtpRegister(phonenumber: $phonenumber, otp: $otp) {
      is_valid_otp
    }
  }
`),
);
