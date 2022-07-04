import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

export const CHANGE_PASSWORD = gql(
  filterGraphql(`
  mutation changeCustomerPassword(
    $currentPassword: String!
    $newPassword: String!
  ) {
    changeCustomerPassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      email
    }
  }
`),
);
