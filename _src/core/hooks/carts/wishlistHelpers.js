import _ from 'lodash';

const wishlistHelpers = ({carts, wishlists, userType}) => {
  const isCart = carts && carts.length > 0;
  const isWishlist = wishlists && wishlists.length > 0;
  if (userType === 'customer' && isCart && isWishlist) {
    const cartWithWishlist = _.map(carts, cart => {
      const productID = _.get(cart, 'product.id');
      const wishlistCart = _.find(
        wishlists,
        wish => wish.productId === productID,
      );

      if (wishlistCart) {
        return _.extend({wishlistId: wishlistCart.wishlistId}, cart);
      }
      return cart;
    });

    return cartWithWishlist;
  }
  return carts;
};

export default wishlistHelpers;
