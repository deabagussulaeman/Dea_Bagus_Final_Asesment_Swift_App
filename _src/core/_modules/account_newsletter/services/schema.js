import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

export const GET_SUBSCRIPTION_STATUS = gql(
  filterGraphql(`
    query getSubscriptionStatus {
        customer {
            firstname
            email
            is_subscribed
        }
    }
`),
);

export const SUBSCRIBE = gql(
  filterGraphql(`
      mutation subscribe(
        $email: String
      ) {
            subscribe(
                input: {
                    email: $email
                }
            ) {
                status {
                    code
                    message
                    response
                }
            }
      }
  `),
);

export const UNSUBSCRIBE = gql(
  filterGraphql(`
      mutation unSubscribe(
        $email: String
      ) {
            unSubscribe(
                input: {
                    email: $email
                }
            ) {
                status {
                    code
                    message
                    response
                }
            }
      }
  `),
);
