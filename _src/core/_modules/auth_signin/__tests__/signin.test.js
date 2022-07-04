import client from '@app/services/api';
import {LOGIN} from '@app/_modules/auth_signin/services/schema';

const loginData = {
  validPassword: {
    userLogin: 'yogi.teza@sirclo.com',
    password: 'Password_123',
  },
  invalidPassword: {
    userLogin: 'yogi.teza@sirclo.com',
    password: 'this_is_wrong_password',
  },
};

//[1] Login using invalid password
test('should throw incorrect sign-in error', () => {
  return expect(
    client.mutate({mutation: LOGIN, variables: loginData.invalidPassword}),
  ).rejects.toThrow(/sign-in was incorrect/);
});

//[2] Login using valid password
test('should get token code', () => {
  return expect(
    client.mutate({mutation: LOGIN, variables: loginData.validPassword}),
  ).resolves.toMatchObject({
    data: {
      generateCustomerTokenCustom: {
        token: expect.any(String),
      },
    },
  });
});
