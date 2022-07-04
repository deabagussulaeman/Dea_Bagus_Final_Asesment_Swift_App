import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

export const CHANGE_EMAIL = gql(
  filterGraphql(`
  mutation updateCustomer(
    $email: String
    $password: String
  ) {
    updateCustomer(
      input: {email: $email, password: $password}
    ) {
      customer {
        email
        firstname
        lastname
        created_at
        date_of_birth
        group_id
        phonenumber
      }
    }
  }
`),
);
