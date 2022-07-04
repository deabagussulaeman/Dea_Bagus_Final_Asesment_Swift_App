import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

export const GET_GIFT_CARD_ACCOUNT = gql(
  filterGraphql(`
  query giftCardAccount($giftCardCode: String!) {
    giftCardAccount(input: {gift_card_code: $giftCardCode}) {
      balance
      code
      expiration_date
      initial_balance
    }
  }
`),
);
