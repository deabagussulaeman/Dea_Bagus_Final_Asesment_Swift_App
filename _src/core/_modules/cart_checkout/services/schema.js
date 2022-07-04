import gql from 'graphql-tag';
import {filterGraphql} from '@app/services/helper';

export const CHECK_GIFT_CARD = gql(
  filterGraphql(`
    query getGiftCardBalance($giftCardCode:String!){
        giftCardAccount(input:{gift_card_code:$giftCardCode}){
            balance
            code
            expiration_date
            code 
        }
    }
`),
);
