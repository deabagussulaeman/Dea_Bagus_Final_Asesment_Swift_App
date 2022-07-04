import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

export const ADD_TO_WISHLIST = gql(
  filterGraphql(`
  mutation addWishlist($productId: Int!) {
    addProductToWishlist(productId: $productId) {
      info
    }
  }
`),
);

export const REMOVE_FROM_WISHLIST = gql(
  filterGraphql(`
  mutation removeWishlist($wishlistItemId: Int!) {
    removeItemWishlist(wishlistItemId: $wishlistItemId) {
      info
    }
  }
`),
);
