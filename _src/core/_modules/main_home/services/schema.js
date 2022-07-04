import gql from 'graphql-tag';
import {filterGraphql} from '@app/services/helper';

export const SUBSCRIBE = gql(
  filterGraphql(`
    mutation subscribe($email: String!) {
      subscribe(input: { email: $email }) {
        status {
          message
          response
        }
      }
    }
  `),
);
