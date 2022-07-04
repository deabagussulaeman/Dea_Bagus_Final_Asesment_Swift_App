import gql from 'graphql-tag';
import {filterGraphql} from '@app/services/helper';

export const CREATE_EMPTY_CART = gql(
  filterGraphql(`
  mutation createEmptyCart {
    createEmptyCart
  }
`),
);

export const MERGE_CARTS = gql(
  filterGraphql(`
  mutation mergeCarts($source_cart_id: String!, $destination_cart_id: String!) {
    mergeCarts(
      source_cart_id: $source_cart_id
      destination_cart_id: $destination_cart_id
    ) {
      id
    }
  }
`),
);

export const CHECKOUT_SESSION_TOKEN = gql(
  filterGraphql(`
  mutation setCheckoutSession($cartId: String!) {
    setCheckoutSession(input: {cart_id: $cartId}) {
      checkout_token
    }
  }
`),
);
