import client from '@app/services/api';
import gql from 'graphql-tag';

const registerSchema = gql`
  mutation createCustomerCustom(
    $email: String
    $password: String
    $firstname: String
    $lastname: String
    $otp: String
    $phonenumber: String
  ) {
    createCustomerCustom(
      input: {
        email: $email
        password: $password
        firstname: $firstname
        lastname: $lastname
        phonenumber: $phonenumber
        otp: $otp
      }
    ) {
      token
    }
  }
`;

const registerData = {
  email: 'yogi.test@sirclo.com',
  password: 'Password_123',
  firstname: 'Yogi',
  lastname: 'Teza',
  phonenumber: '08123456789',
  otp: '',
};

//--------- JALANKAN TEST SATU PERSATU, JANGAN BERSAMAAN ---------//

//[1] Testing OTP validation using invalid OTP code
test('should throw incorrect OTP error', () => {
  return expect(
    client.mutate({mutation: registerSchema, variables: registerData}),
  ).rejects.toThrow(/OTP code is incorrect/);
});

//[2] Testing registration validation using registered phone number
test('should throw registered phone number error', () => {
  return expect(
    client.mutate({mutation: registerSchema, variables: registerData}),
  ).rejects.toThrow(/phone number already exists/);
});

//[3] Testing registration validation using registered email
test('should throw registered email error', () => {
  return expect(
    client.mutate({mutation: registerSchema, variables: registerData}),
  ).rejects.toThrow(/email address already exists/);
});

//[4] Testing OTP validation using valid OTP code
test('should successfully register an account', () => {
  return expect(
    client.mutate({mutation: registerSchema, variables: registerData}),
  ).resolves.toMatch(/ /);
  /* masih internal server error */
});
