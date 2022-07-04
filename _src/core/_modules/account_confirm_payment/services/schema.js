import gql from 'graphql-tag';
import {filterGraphql} from '@app/services/helper';

export const MUTATION_CONFIRM_PAYMENT = gql(
  filterGraphql(`
  mutation createConfirmPayment($input: ConfirmPaymentInput) {
    createConfirmPayment(input: $input) {
      success
    }
  }
`),
);
