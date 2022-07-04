import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

export const UPDATE_ACCOUNT_INFORMATION = gql(
  filterGraphql(`
  mutation updateCustomer(
    $firstname: String
    $lastname: String
  ) {
    updateCustomer(
      input: {firstname: $firstname, lastname: $lastname}
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
