import {useReactiveVar} from '@apollo/client';
import React, {createContext, useEffect, useRef, useState} from 'react';
import useCarts, {TYPES} from '@app/hooks/carts/useCarts';
import {rxUserType, rxUserWIshlistItems} from '@app/services/cache';
import {navigateTo} from '@app/helpers/Navigation';
import {getParameterValue} from '@app/helpers/RemoteConfig';
import {
  TYPE_BOOLEAN,
  PWA_CHECKOUT_PARAMETER,
  USER_CUSTOMER,
} from '@app/helpers/Constants';
import {modules} from '@root/swift.config';
import {useTranslation} from 'react-i18next';
import {useIsFocused} from '@react-navigation/native';
import {guestCheckout} from '@root/swift.config';
import Views from '@app/_modules/cart/views';

export const CartContext = createContext();

const CartController = props => {
  if (!modules.cart.enable) {
    return null;
  }
  /**
   * ---------------------------------------------------- *
   * @constant controllerProps
   * @summary collections constant for
   * this contorller
   * ---------------------------------------------------- *
   */
  const useBack = props.route.params?.useBack ? true : false;
  const {t} = useTranslation();
  const getRxUserType = useReactiveVar(rxUserType);
  const getRxUserWishlistItems = useReactiveVar(rxUserWIshlistItems);
  const isFocused = useIsFocused();
  const [cartContextProps, setCartContextProps] = useState({
    loading: false,
  });

  /**
   * hooks cart items
   */
  const {
    data: items,
    setCart: getItems,
    compareLocal,
  } = useCarts({
    initialized: true,
    type: TYPES.ITEM,
  });

  /**
   * hooks cart prices
   */
  const {
    data: price,
    setCart: getPrice,
    loading: loadingPrice,
  } = useCarts({
    initialized: true,
    type: TYPES.PRICE,
  });

  const mount = useRef();
  /**
   * ----------------------------------------- *
   * @dependency []
   * @summary component did mount
   * request cart data
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    mount.current = true;
    if (mount.current) {
      getItems();
      getPrice();
    }

    return () => {
      mount.current = false;
    };
  }, []);

  useEffect(() => {
    if (mount.current && isFocused) {
      getItems();
      getPrice();
    }
  }, [isFocused]);

  /**
   * ---------------------------------------------------- *
   * @function onNavigateToProductDetail
   * @summary navigate to product detail product
   * ---------------------------------------------------- *
   */
  const onNavigateToProductDetail = productUrlKey => {
    navigateTo(modules.product_detail.enable, modules.product_detail.name, {
      productUrlKey,
    });
  };

  /**
   * ---------------------------------------------------- *
   * @function onNavigateToShipping
   * @summary navigate to shpping page
   * ---------------------------------------------------- *
   */
  const onNavigateToShipping = async () => {
    const checkFirst = await compareLocal();
    if (checkFirst) {
      if (!guestCheckout.enable && getRxUserType !== USER_CUSTOMER) {
        navigateTo(modules.account.enable, modules.account.name);
      }

      const getRemoteConfigPWACheckout = getParameterValue({
        parameter: PWA_CHECKOUT_PARAMETER,
        type: TYPE_BOOLEAN,
      });
      /**
       * go to pwa checkout
       */
      if (getRemoteConfigPWACheckout) {
        if (modules.cart_checkout_pwa.enable) {
          navigateTo(
            modules.cart_checkout_pwa.enable,
            modules.cart_checkout_pwa.name,
          );
          return;
        }
      }
      /**
       * go to normal checkout
       */
      if (modules.cart_checkout.enable) {
        return navigateTo(
          modules.cart_checkout.enable,
          modules.cart_checkout.name,
        );
      }
    }
  };

  /**
   * ---------------------------------------------------- *
   * @const {ctxProps}
   * @summary for context passing data to children
   * ---------------------------------------------------- *
   */
  const ctxProps = {
    cartContextProps,
    setCartContextProps,
  };

  /**
   * ---------------------------------------------------- *
   * @const {controllerProps}
   * @summary for controller passing data to view
   * ---------------------------------------------------- *
   */
  const controllerProps = {
    ...ctxProps,
    t,
    cartItems: items,
    cartPrices: price,
    userType: getRxUserType,
    onNavigateToProductDetail,
    onNavigateToShipping,
    loadingPrice,
    useBack,
    wishlistItems: getRxUserWishlistItems,
  };

  return (
    <CartContext.Provider value={ctxProps}>
      <Views {...controllerProps} />
    </CartContext.Provider>
  );
};

export default CartController;
