import {useEffect, useMemo, useRef} from 'react';
import {useReactiveVar, useMutation, useApolloClient} from '@apollo/client';
import {
  rxCartId,
  rxCartDataAddress,
  rxCartDataItem,
  rxCartDataPrice,
  rxUserWIshlistItems,
  rxUserType,
  rxAppSnackbar,
  rxCartInfo,
  rxCartSelectedPaymentMethod,
  rxCartAvailablePaymentMethod,
  rxCartAppliedCoupon,
  rxCartGiftCard,
  rxCartAppliedStoreCredit,
  rxCartAppliedRewardPoint,
  rxCartPayment,
  rxCartBillingAddress,
  rxCartItems,
  rxCartIsVirtual,
  rxCartQty,
  rxCartPrices,
  rxCartExtraFee,
  rxCartPaymentMethod,
  rxCartPickupStore,
  rxCartShipping,
  rxCartShippingAmount,
  rxCartShippingAddress,
  rxCartShippingMethod,
  rxCartSnapUrl,
  rxCartDataInformation,
  rxUserDefaultShippingAddressId,
  rxCartProcessingAPICount,
  rxCartDataBackupItem,
  rxCartInitLoading,
} from '@app/services/cache';
import cartSchema from '@app/hooks/carts/schema';
import useCustomQuery from '@app/hooks/useCustomQuery';

import _ from 'lodash';
import wishlistHelpers from '@app/hooks/carts/wishlistHelpers';
import {Storage} from '@app/helpers/Storage';
import {Alert} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  CHECKOUT_SESSION_TOKEN,
  CREATE_EMPTY_CART,
  MERGE_CARTS,
} from '@app/services/queries/cart';
import clientGQL from '@app/services/api';
import ErrorHandler from '@app/helpers/ErrorHandler';
import i18next, {useTranslation} from 'react-i18next';
import {
  TYPENAME_BUNDLE,
  TYPENAME_CONFIGURABLE,
  TYPENAME_VIRTUAL,
  CART_ID,
  USER_CUSTOMER,
} from '@app/helpers/Constants';

export const TYPES = {
  ITEM: 'ITEM',
  ADDRESS: 'ADDRESS',
  PRICE: 'PRICE',
  INFO: 'INFO',
  APPLIED_COUPON: 'APPLIED_COUPON',
  APPLIED_GIFTCARD: 'APPLIED_GIFTCARD',
  APPLIED_REWARD_POINT: 'APPLIED_REWARD_POINT',
  APPLIED_STORE_CREDIT: 'APPLIED_STORE_CREDIT',
  AVAILABLE_PAYMENT: 'AVAILABLE_PAYMENT',
  SELECTED_PAYMENT: 'SELECTED_PAYMENT',
};

export const incrementProcessingAPICount = () => {
  rxCartProcessingAPICount(rxCartProcessingAPICount() + 1);
};

export const decrementProcessingAPICount = () => {
  if (rxCartProcessingAPICount() > 0) {
    rxCartProcessingAPICount(rxCartProcessingAPICount() - 1);
  }
};

export const resetProcessingAPICount = () => {
  rxCartProcessingAPICount(0);
};

export const onClearAllDataCart = () => {
  rxCartPayment([]);
  rxCartGiftCard(null);
  rxCartAppliedCoupon(null);
  rxCartAppliedStoreCredit(null);
  rxCartAppliedRewardPoint(null);
  rxCartSelectedPaymentMethod(null);
  rxCartAvailablePaymentMethod(null);
  rxCartBillingAddress(null);
  rxCartItems(null);
  rxCartId(null);
  rxCartIsVirtual(false);
  rxCartQty(0);
  rxCartPrices(null);
  rxCartExtraFee(null);
  rxCartPaymentMethod(null);
  rxCartPickupStore(null);
  rxCartShipping([]);
  rxCartShippingAmount(null);
  rxCartShippingAddress(null);
  rxCartShippingMethod(null);
  rxCartInfo(null);
  rxCartSnapUrl(null);
  rxCartDataInformation(null);
  rxCartDataItem([]);
  rxCartDataAddress(null);
  rxCartDataPrice(null);
  rxUserDefaultShippingAddressId(null);
  rxCartInitLoading(true);
};

export const getEmptyCart = async (retryCounter = 0) => {
  const userType = rxUserType();
  try {
    const res = await clientGQL.mutate({mutation: CREATE_EMPTY_CART});

    if (typeof res?.data?.createEmptyCart !== 'string') {
      throw new Error('Cart ID invalid type');
    }

    await Storage.set(Storage.name.CART_ID, res.data.createEmptyCart);

    if (userType === USER_CUSTOMER) {
      const guestCartId = await Storage.get(Storage.name.CART_ID_GUEST);
      if (guestCartId) {
        await Storage.set(Storage.name.CART_ID_GUEST, null);

        await clientGQL.mutate({
          mutation: MERGE_CARTS,
          variables: {
            source_cart_id: guestCartId,
            destination_cart_id: res.data.createEmptyCart,
          },
        });
      }
    } else {
      await Storage.set(Storage.name.CART_ID_GUEST, res.data.createEmptyCart);
    }

    rxCartId(res.data.createEmptyCart);
    rxUserDefaultShippingAddressId(null);
    crashlytics().setAttribute(CART_ID, res.data.createEmptyCart);

    return res.data.createEmptyCart;
  } catch (error) {
    Alert.alert(
      'Error create empty cart',
      error.message + (retryCounter < 2 ? '' : '\nWe will fix it shortly'),
      [
        {
          text: retryCounter < 2 ? 'Retry' : 'OK',
          onPress: () => {
            if (retryCounter < 2) {
              getEmptyCart(retryCounter + 1);
            }
          },
        },
      ],
      {cancelable: false},
    );
  }
};

export const getStoredCartId = async () => {
  const cartId = await Storage.get(Storage.name.CART_ID);
  const userType = await Storage.get(Storage.name.USER_TYPE);

  if (!cartId || userType === USER_CUSTOMER) {
    getEmptyCart(userType);
  } else {
    crashlytics().setAttribute(CART_ID, cartId);
    rxCartId(cartId);
  }
};

export const getCheckoutSessionToken = async () => {
  try {
    const cartId = await rxCartId();
    const res = await clientGQL.mutate({
      mutation: CHECKOUT_SESSION_TOKEN,
      variables: {
        cartId,
      },
    });

    const checkoutSessionToken = _.get(
      res,
      'data.setCheckoutSession.checkout_token',
    );
    if (checkoutSessionToken) {
      await Storage.set(
        Storage.name.CHECKOUT_SESSION_TOKEN,
        checkoutSessionToken,
      );
    } else {
      const ERROR = new ErrorHandler({
        message: i18next.t('message.errorGetToken'),
      });
      ERROR.initHandleError();
    }
  } catch (err) {
    const ERROR = new ErrorHandler({err});
    ERROR.initHandleError();
  }
};

const useCarts = ({initialized = false, type, configErr}) => {
  const client = useApolloClient();
  const {
    data: fromNetwork,
    error,
    loading,
    onRefetchData: fetchItems,
    setDynamicSchemas,
    setDynamicVariables,
  } = useCustomQuery({
    isDynamicQuery: true,
    isDynamicVariables: true,
    configErr,
    opts: {fetchPolicy: type === TYPES.ITEM ? 'no-cache' : 'network-only'},
  });

  const mount = useRef();
  const {t} = useTranslation();
  const getRxCartId = useReactiveVar(rxCartId);
  const getRxUserWishlistItems = useReactiveVar(rxUserWIshlistItems);
  const getRxUserType = useReactiveVar(rxUserType);

  const {
    getItems,
    getAddress,
    getPrice,
    getAppliedGiftCard,
    getCartInformation,
    getAppliedRewardPoint,
    getAppliedStoreCredit,
    getSelectedPaymentMethod,
    getAvailablePaymentMethod,
    getAppliedCoupon,
    addSimpleItemToCart,
    addConfigurableItemToCart,
    addBundleItemToCart,
    addVirtualItemToCart,
    removeItemOnCart,
    updateItemOnCart,
  } = cartSchema();

  const [addSimple] = useMutation(addSimpleItemToCart);
  const [addVirtual] = useMutation(addVirtualItemToCart);
  const [addConfigurable] = useMutation(addConfigurableItemToCart);
  const [addBundle] = useMutation(addBundleItemToCart);
  const [removeItem] = useMutation(removeItemOnCart);
  const [updateQty] = useMutation(updateItemOnCart);

  useEffect(() => {
    if (mount) {
      mount.current = true;
      if (mount.current) {
        setDynamicVariables({
          cartID: getRxCartId,
        });
        switch (type) {
          case TYPES.ITEM:
            setDynamicSchemas(getItems);
            break;
          case TYPES.ADDRESS:
            setDynamicSchemas(getAddress);
            break;
          case TYPES.PRICE:
            setDynamicSchemas(getPrice);
            break;
          case TYPES.SELECTED_PAYMENT:
            setDynamicSchemas(getSelectedPaymentMethod);
            break;
          case TYPES.AVAILABLE_PAYMENT:
            setDynamicSchemas(getAvailablePaymentMethod);
            break;
          case TYPES.INFO:
            setDynamicSchemas(getCartInformation);
            break;
          case TYPES.APPLIED_COUPON:
            setDynamicSchemas(getAppliedCoupon);
            break;
          case TYPES.APPLIED_GIFTCARD:
            setDynamicSchemas(getAppliedGiftCard);
            break;
          case TYPES.APPLIED_REWARD_POINT:
            setDynamicSchemas(getAppliedRewardPoint);
            break;
          case TYPES.APPLIED_STORE_CREDIT:
            setDynamicSchemas(getAppliedStoreCredit);
            break;
          // default:
          //   setDynamicSchemas(getItems);
          //   break;
        }

        if (initialized) {
          setCart();
        }
      }
    }

    return () => {
      mount.current = false;
    };
  }, []);

  const getRxCartDataItem = useReactiveVar(rxCartDataItem);
  const getRxCartDataAddress = useReactiveVar(rxCartDataAddress);
  const getRxCartDataPrice = useReactiveVar(rxCartDataPrice);
  const getRxCartInfo = useReactiveVar(rxCartInfo);
  const getRxCartSelectedPayment = useReactiveVar(rxCartSelectedPaymentMethod);
  const getRxCartAppliedCoupon = useReactiveVar(rxCartAppliedCoupon);
  const getRxCartAppliedStoreCredit = useReactiveVar(rxCartAppliedStoreCredit);
  const getRxCartAppliedRewardPoint = useReactiveVar(rxCartAppliedRewardPoint);
  const getRxCartGiftCard = useReactiveVar(rxCartGiftCard);
  const getRxCartAvailablePayment = useReactiveVar(
    rxCartAvailablePaymentMethod,
  );

  const data = useMemo(() => {
    switch (type) {
      case TYPES.ITEM:
        const appendWishlist = wishlistHelpers({
          carts: getRxCartDataItem,
          getRxUserType,
          getRxUserWishlistItems,
        });
        return appendWishlist;
      case TYPES.ADDRESS:
        return getRxCartDataAddress;
      case TYPES.PRICE:
        return getRxCartDataPrice;
      case TYPES.INFO:
        return getRxCartInfo;
      case TYPES.SELECTED_PAYMENT:
        return getRxCartSelectedPayment;
      case TYPES.AVAILABLE_PAYMENT:
        return getRxCartAvailablePayment;
      case TYPES.APPLIED_COUPON:
        return getRxCartAppliedCoupon;
      case TYPES.APPLIED_GIFTCARD:
        return getRxCartGiftCard;
      case TYPES.APPLIED_REWARD_POINT:
        return getRxCartAppliedRewardPoint;
      case TYPES.APPLIED_STORE_CREDIT:
        return getRxCartAppliedStoreCredit;
      default:
        return getRxCartDataItem;
    }
  }, [
    type,
    fromNetwork,
    getRxCartDataItem,
    getRxCartDataAddress,
    getRxCartDataPrice,
    getRxCartInfo,
    getRxCartSelectedPayment,
    getRxCartAvailablePayment,
    getRxCartAppliedCoupon,
    getRxCartAppliedRewardPoint,
    getRxCartAppliedStoreCredit,
    getRxUserWishlistItems,
  ]);

  const setCart = async params => {
    if (mount.current && params) {
      switch (type) {
        case TYPES.ITEM:
          params.items.forEach(item => {
            const itemSku = _.get(item, 'product.sku');

            params.available_free_items.forEach(freeItem => {
              const freeItemSku = _.get(freeItem, 'sku');
              if (itemSku === freeItemSku) {
                item.product = {...item.product, is_free_item: true};
              }
            });
          });
          const cartItems = _.get(params, 'items');
          if (cartItems) {
            rxCartDataItem(cartItems);
            rxCartDataBackupItem(cartItems);
            resetProcessingAPICount();
            rxCartInitLoading(false);
          }
          break;
        case TYPES.ADDRESS:
          let dataAddress = {shipping_addresses: null, billing_address: null};
          const shippingAddress = _.get(params, 'shipping_addresses');
          const billingAddress = _.get(params, 'billing_address');
          const cartInfo = {
            ...rxCartInfo(),
            id: _.get(params, 'id'),
            email: _.get(params, 'email'),
            total_quantity: _.get(params, 'total_quantity'),
          };
          if (shippingAddress) {
            dataAddress.shipping_addresses = shippingAddress;
          }
          if (billingAddress) {
            dataAddress.billing_address = billingAddress;
          }
          rxCartDataAddress(dataAddress);
          rxCartInfo(cartInfo);
          break;
        case TYPES.PRICE:
          const dataPrice = _.get(params, 'prices');
          if (dataPrice) {
            rxCartDataPrice(dataPrice);
          }
          break;
        case TYPES.INFO:
          rxCartInfo(params);
          break;
        case TYPES.SELECTED_PAYMENT:
          const selectedPayment = _.get(params, 'selected_payment_method');
          rxCartSelectedPaymentMethod(selectedPayment);
          break;
        case TYPES.AVAILABLE_PAYMENT:
          const availablePayment = _.get(params, 'available_payment_methods');
          rxCartAvailablePaymentMethod(availablePayment);
          break;
        case TYPES.APPLIED_COUPON:
          const appliedCoupon = _.get(params, 'applied_coupons');
          rxCartAppliedCoupon(appliedCoupon);
          break;
        case TYPES.APPLIED_GIFTCARD:
          const appliedGiftCard = _.get(params, 'applied_giftcard');
          rxCartGiftCard(appliedGiftCard);
          break;
        case TYPES.APPLIED_REWARD_POINT:
          const appliedRewardPoint = _.get(params, 'applied_reward_points');
          rxCartAppliedRewardPoint(appliedRewardPoint);
          break;
        case TYPES.APPLIED_STORE_CREDIT:
          const appliedStoreCredit = _.get(params, 'applied_store_credit');
          rxCartAppliedStoreCredit(appliedStoreCredit);
          break;
        default:
          const cartItem = _.get(params, 'items');
          const cartPrice = _.get(params, 'prices');
          if (cartItem) {
            rxCartDataItem(cartItem);
          }
          if (cartPrice) {
            rxCartDataPrice(cartPrice);
          }
          break;
      }
    } else {
      await fetchItems({
        params: {cartID: getRxCartId},
      });
    }
  };

  const isExistInCart = (
    itemInCart,
    newItem,
    skuProduct,
    selectedOptions,
    isAdd = true,
  ) => {
    const newItemTypename = isAdd
      ? newItem.__typename
      : newItem.product.__typename;

    if (
      itemInCart.product.sku === skuProduct &&
      itemInCart.product.__typename === TYPENAME_BUNDLE &&
      newItemTypename === TYPENAME_BUNDLE
    ) {
      let itemInCartValue = [];
      let newItemValue = [];

      // from cart
      itemInCart.bundle_options.map(opt => {
        const optParentId = opt.id * 100000;
        itemInCartValue.push(optParentId);
        opt.values.map(value => {
          itemInCartValue.push(optParentId + value.id);
        });
      });

      // when add to cart
      if (isAdd === true) {
        selectedOptions.map(opt => {
          const optParentId = opt.id * 100000;
          newItemValue.push(optParentId);
          opt.value.map(val => {
            newItemValue.push(optParentId + val);
          });
        });
      }
      // when remove
      else {
        newItem.bundle_options.map(opt => {
          const optParentId = opt.id * 100000;
          newItemValue.push(optParentId);
          opt.values.map(value => {
            newItemValue.push(optParentId + value.id);
          });
        });
      }

      itemInCartValue = itemInCartValue.sort().toString();
      newItemValue = newItemValue.sort().toString();

      if (itemInCartValue === newItemValue) {
        return true;
      }
      return false;
    } else {
      return itemInCart.product.sku === skuProduct;
    }
  };

  const getCartDataIsNotExistItem = (
    carts,
    item,
    quantity,
    skuProduct,
    selectedOptions,
  ) => {
    if (item.__typename === TYPENAME_BUNDLE) {
      let bundle_options = [];
      let newId = [];

      selectedOptions.map(opt => {
        let option = {id: opt.id, __typename: 'SelectedBundleOption'};
        let values = [];

        let findOption = item.items.find(op => op.option_id === opt.id);
        let optParentId = opt.id * 100000;
        newId.push(optParentId);

        opt.value.map(val => {
          let findValue = findOption.options.find(value => value.id === val);

          values.push({
            id: findValue.id,
            label: findValue.label,
            quantity: findValue.quantity,
            price: findValue.price,
            __typename: 'SelectedBundleOptionValue',
          });
          newId.push(optParentId + val);
        });
        bundle_options.push({...option, values});
      });

      const bundleId = skuProduct + '-' + newId.sort().toString() + '-local';

      return [
        ...carts,
        {
          product: item,
          quantity: parseInt(quantity),
          id: bundleId,
          bundle_options,
        },
      ];
    } else if (item.__typename === TYPENAME_CONFIGURABLE) {
      const productVariant = item.variants.find(variant => {
        return variant.product.sku === skuProduct;
      });
      return [
        ...carts,
        {
          product: productVariant?.product,
          quantity: parseInt(quantity),
          id: `${skuProduct}-local`,
        },
      ];
    }
    return [
      ...carts,
      {
        product: item,
        quantity: parseInt(quantity),
        id: `${skuProduct}-local`,
      },
    ];
  };

  /**
   * ---------------------------------------------------- *
   * @const setCartByResponse
   * @summary set cart by response for simple & configurable product
   * ---------------------------------------------------- *
   */
  const setCartByResponse = ({response, productType}) => {
    // decrement processing after API Response
    decrementProcessingAPICount();
    let dataParams = null;
    if (productType === TYPENAME_CONFIGURABLE) {
      dataParams = _.get(response, 'data.addConfigurableProductsToCart.cart');
    } else if (productType === TYPENAME_BUNDLE) {
      dataParams = _.get(response, 'data.addBundleProductsToCart.cart');
    } else if (productType === TYPENAME_VIRTUAL) {
      dataParams = _.get(response, 'data.addVirtualProductsToCart.cart');
    } else {
      dataParams = _.get(response, 'data.addSimpleProductsToCart.cart');
    }

    if (rxCartProcessingAPICount() === 0) {
      if (dataParams) {
        setCart(dataParams);
        rxAppSnackbar({
          message: t('message.successProductAdded'),
        });
      } else {
        setCart({items: rxCartDataBackupItem()});
      }
    } else {
      if (dataParams) {
        rxCartDataBackupItem(dataParams.items);
      }
    }
  };

  /**
   * Add to cart function
   * @param {object, string, number} product product to be added, its type and quantity
   * @param {function} callback function to be called from view
   */
  const addToCart = async (
    {item, types, quantity, parentSku, selectedOptions, skuProduct},
    callback,
  ) => {
    if (getRxCartId) {
      //get the sku of the product
      // const skuProduct = _.get(item, 'sku');
      skuProduct = skuProduct ?? _.get(item, 'sku');
      // get the cart items from reactive variable
      let carts = [];
      if (getRxCartDataItem && getRxCartDataItem.length > 0) {
        carts = getRxCartDataItem;
      }

      // add the quantity if selected product already in cart
      const existedItem = _.map(carts, function (cart) {
        return isExistInCart(cart, item, skuProduct, selectedOptions)
          ? {...cart, quantity: parseInt(cart.quantity) + parseInt(quantity)}
          : cart;
      });

      //check if product is in cart
      const isExist = _.find(carts, function (obj) {
        // return obj.product.sku === skuProduct;
        return isExistInCart(obj, item, skuProduct, selectedOptions);
      });

      // if existed
      const tempItem = isExist
        ? existedItem
        : getCartDataIsNotExistItem(
            carts,
            item,
            quantity,
            skuProduct,
            selectedOptions,
          );

      // set to reactive var before mutation
      setCart({items: tempItem});
      rxAppSnackbar({
        message: t('message.productAdded'),
      });

      // run the callback if exist
      if (callback) {
        await callback();
      }

      try {
        let response = null;
        incrementProcessingAPICount();

        if (types === TYPENAME_CONFIGURABLE) {
          response = await addConfigurable({
            variables: {
              input: {
                cart_id: getRxCartId,
                cart_items: [
                  {
                    parent_sku: parentSku,
                    data: {
                      quantity,
                      sku: skuProduct,
                    },
                  },
                ],
              },
            },
          });
        } else if (types === TYPENAME_BUNDLE) {
          response = await addBundle({
            variables: {
              input: {
                cart_id: getRxCartId,
                cart_items: [
                  {
                    bundle_options: selectedOptions,
                    data: {
                      quantity,
                      sku: skuProduct,
                    },
                  },
                ],
              },
            },
          });
        } else if (types === TYPENAME_VIRTUAL) {
          response = await addVirtual({
            variables: {
              input: {
                cart_id: getRxCartId,
                cart_items: [
                  {
                    customizable_options: [],
                    data: {
                      quantity,
                      sku: skuProduct,
                    },
                  },
                ],
              },
            },
          });
        } else {
          //simple product
          response = await addSimple({
            variables: {
              input: {
                cart_id: getRxCartId,
                cart_items: [
                  {
                    data: {
                      quantity,
                      sku: skuProduct,
                    },
                  },
                ],
              },
            },
          });
        }

        setCartByResponse({
          response,
          productType: types,
        });
      } catch (err) {
        decrementProcessingAPICount();
        if (rxCartProcessingAPICount() === 0) {
          setCart({items: rxCartDataBackupItem()});
          const ERROR = new ErrorHandler({err});
          ERROR.initHandleError();
        }
      }
    }
  };

  const removeFromCart = async ({item}) => {
    if (getRxCartId) {
      let carts = [];
      let backupCartItems = [];
      if (getRxCartDataItem && getRxCartDataItem.length > 0) {
        carts = getRxCartDataItem;
        backupCartItems = [...getRxCartDataItem];
      }

      let itemToBeRemoved = [];
      carts.map(obj => {
        if (isExistInCart(obj, item, item.product.sku, [], false)) {
          itemToBeRemoved.push({...obj, hide: true});
        } else {
          itemToBeRemoved.push({...obj});
        }
      });

      setCart({items: itemToBeRemoved});
      rxAppSnackbar({
        message: t('message.productRemoved'),
      });

      try {
        if (!item.id.includes('local')) {
          const response = await removeItem({
            variables: {
              input: {
                cart_id: getRxCartId,
                cart_item_id: item.id,
              },
            },
          });
          const dataParams = _.get(response, 'data.removeItemFromCart.cart');
          if (dataParams) {
            setCart(dataParams);
            rxAppSnackbar({
              message: t('message.successProductRemoved'),
            });
          } else {
            setCart({items: backupCartItems});
          }
        }
      } catch (err) {
        setCart({items: backupCartItems});
        const ERROR = new ErrorHandler({err});
        ERROR.initHandleError();
      }
    }
  };

  const updateQuantity = async ({item, qty}) => {
    if (getRxCartId) {
      let carts = [];
      let backupCartItems = [];
      if (getRxCartDataItem && getRxCartDataItem.length > 0) {
        carts = getRxCartDataItem;
        backupCartItems = [...getRxCartDataItem];
      }

      try {
        const tempCart = _.map(carts, function (obj) {
          if (obj.id === item.id) {
            return {...obj, quantity: qty};
          } else {
            return obj;
          }
        });

        //reactive var
        setCart({items: tempCart});

        rxAppSnackbar({
          message: t('message.qtyUpdated'),
        });

        const response = await updateQty({
          variables: {
            input: {
              cart_id: getRxCartId,
              cart_items: [
                {
                  cart_item_id: item.id,
                  quantity: qty,
                },
              ],
            },
          },
        });
        const dataParams = _.get(response, 'data.updateCartItems.cart');
        if (dataParams) {
          setCart(dataParams);
          rxAppSnackbar({
            message: t('message.successQtyUpdated'),
          });
        } else {
          setCart({items: backupCartItems});
        }
      } catch (err) {
        setCart({items: backupCartItems});
        const ERROR = new ErrorHandler({err});
        ERROR.initHandleError();
      }
    }
  };

  const compareLocal = async () => {
    const res = await client.query({
      variables: {cartID: getRxCartId},
      query: getPrice,
    });
    const priceRemote = _.get(
      res,
      'data.cart.prices.subtotal_excluding_tax.value',
    );
    const priceLocal = _.get(
      getRxCartDataPrice,
      'subtotal_excluding_tax.value',
    );
    if (priceLocal === priceRemote) {
      return true;
    } else {
      rxAppSnackbar({
        message: t('message.itemNotProcessed'),
      });
      setCart();
      return false;
    }
  };

  useEffect(() => {
    const response = _.get(fromNetwork, 'data.cart');
    if (type && response) {
      setCart(response);
    }
  }, [fromNetwork, type]);

  return {
    data,
    error,
    loading,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    compareLocal,
  };
};

export default useCarts;
