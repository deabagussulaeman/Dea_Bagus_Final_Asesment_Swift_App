// import AnalyticsHelper from '@app/helpers/Analytics';
import {Colors} from '@app/styles';
import PropTypes from 'prop-types';
import React from 'react';
import {useReactiveVar} from '@apollo/client';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import {rxUserTheme} from '@app/services/cache';
import Section from '@app/components/Section';
import Show from '@app/components/Show';
// import useWishlists from '@app/hooks/wishlists/useWishlists';
import useDataCustomer from '@app/hooks/customer/useDataCustomer';

const ToggleWishlist = ({
  item,
  productId,
  productName,
  productSku,
  productCurrency,
  productPrice,
  wishlistItemId = null,
  children,
  styleProp = {},
  iconSize = 25,
  callback = null,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  const {addToWishlist, removeFromWishlist} = useDataCustomer({
    initialized: false,
  });

  /**
   * ---------------------------------------------------- *
   * @function onLogWishlistToAnalytics
   * @summary log add/remove wishlist item to analytics
   * ---------------------------------------------------- *
   */
  // const onLogWishlistToAnalytics = () => {
  //   const item = {
  //     item_name: productName,
  //     item_sku: productSku,
  //     value: productPrice,
  //     currency: productCurrency,
  //   };
  //   if (wishlistItemId) {
  //     AnalyticsHelper.eventAddItemWishlist({item});
  //   } else {
  //     AnalyticsHelper.eventRemoveItemWishlist({item});
  //   }
  // };

  /**
   * ---------------------------------------------------- *
   * @function onAddToWishlist
   * @summary add product to wishlist and refetch list
   * ---------------------------------------------------- *
   */
  const onAddToWishlist = async () => {
    await addToWishlist(item);
    if (callback) {
      await callback();
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function onRemoveFromWishlist
   * @summary remove product to wishlist and refetch list
   * ---------------------------------------------------- *
   */
  const onRemoveFromWishlist = async () => {
    await removeFromWishlist(item);
    if (callback) {
      await callback();
    }
  };

  return (
    <Section
      style={[styleProp]}
      onPress={wishlistItemId ? onRemoveFromWishlist : onAddToWishlist}>
      <Show radius={25} padding border when={!children}>
        <FontAwesomeIcons
          name={wishlistItemId ? 'heart' : 'heart-o'}
          size={iconSize}
          color={
            wishlistItemId
              ? Colors.PRIMARY
              : getRxUserTheme === 'dark'
              ? Colors.GRAY_DARK
              : Colors.BLACK
          }
        />
      </Show>
      <Show when={children}>
        <Section>{children}</Section>
      </Show>
    </Section>
  );
};

ToggleWishlist.propTypes = {
  // item
  item: PropTypes.any,
  // product id
  productId: PropTypes.any,
  // product name
  productName: PropTypes.any,
  // product sku
  productSku: PropTypes.any,
  // product currency
  productCurrency: PropTypes.any,
  // product price
  productPrice: PropTypes.any,
  // wishlist item id
  wishlistItemId: PropTypes.any,
  // children
  children: PropTypes.any,
  // style
  styleProp: PropTypes.object,
  // icon size
  iconSize: PropTypes.number,
  // func
  callback: PropTypes.func,
};

export default ToggleWishlist;
