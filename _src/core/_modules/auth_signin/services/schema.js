import gql from 'graphql-tag';
import {filterGraphql} from '@app/services/helper';

export const LOGIN = gql(
  filterGraphql(`
  mutation generateCustomerToken($userLogin: String!, $password: String!) {
    generateCustomerTokenCustom(username: $userLogin, password: $password) {
      token
    }
  }
`),
);
