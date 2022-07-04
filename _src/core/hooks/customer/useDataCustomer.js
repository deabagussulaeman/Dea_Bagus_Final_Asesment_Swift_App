import {useEffect, useMemo, useRef} from 'react';
import {useReactiveVar, useMutation} from '@apollo/client';
import {USER_CUSTOMER} from '@app/helpers/Constants';
import {
  rxAppSnackbar,
  rxUserType,
  rxUserInformation,
  rxUserStoreCredit,
  rxUserToken,
  rxUserRewardPoint,
  rxUserWIshlistItems,
  rxWishlistDataInformation,
  rxUserAddresses,
} from '@app/services/cache';
import {onClearAllDataCart} from '@app/hooks/carts/useCarts';
import {getEmptyCart} from '@app/hooks/carts/useCarts';
import {Storage} from '@app/helpers/Storage';
import {parseAddress} from '@app/helpers/Address';
import {useSelectShippingAddress} from '@app/hooks/carts/useSelectShippingAddress';

import ErrorHandler from '@app/helpers/ErrorHandler';
import schemaHooks from '@app/hooks/customer/schema';
import useCustomQuery from '@app/hooks/useCustomQuery';
import i18next from 'i18next';
import _ from 'lodash';

export const TYPES = {
  USER_INFO: 'USER_INFO',
  USER_ADDRESS: 'USER_ADDRESS',
  USER_ADDRESS_WITH_SET_CART_ADDRESS: 'USER_ADDRESS_WITH_SET_CART_ADDRESS',
  USER_STORE_CREDIT: 'USER_STORE_CREDIT',
  USER_REWARD_POINT: 'USER_REWARD_POINT',
  USER_CUSTOMER_ADDRESS_SIMPLE: 'USER_CUSTOMER_ADDRESS_SIMPLE',
  USER_WISHLIST_INFORMATION: 'USER_WISHLIST_INFORMATION',
  USER_WISHLIST_ITEM: 'USER_WISHLIST_ITEM',
};

/**
 * ---------------------------------------------------- *
 * @const {onClearAllDataUser}
 * @summary clear data user login
 * ---------------------------------------------------- *
 */

export const onClearAllDataUser = () => {
  rxUserInformation(null);
  rxUserType(null);
  rxUserToken(null);
  rxUserStoreCredit(null);
  rxUserRewardPoint(null);
  rxUserWIshlistItems(null);
  rxUserAddresses(null);
};

export const onSessionExpired = async () => {
  try {
    onClearAllDataCart();
    onClearAllDataUser();
    await Storage.clear();
    await getEmptyCart();
  } catch (err) {
    console.log('[err] logout', err);
  }
};

const useDataCustomer = ({initialized = false, type, configErr = null}) => {
  const {
    GET_USER_INFO,
    GET_USER_ADDRESS,
    GET_USER_STORE_CREDIT,
    GET_USER_REWARD_POINT,
    GET_USER_WISHLIST_INFORMATION,
    GET_USER_WISHLIST_ITEM,
    ADD_WISHLIST,
    REMOVE_WISHLIST,
  } = schemaHooks();
  const getRxUserType = useReactiveVar(rxUserType);
  const getRxUserInformation = useReactiveVar(rxUserInformation);
  const getRxUserAddresses = useReactiveVar(rxUserAddresses);
  const getRxUserWIshlistItems = useReactiveVar(rxUserWIshlistItems);
  const getRxWishlistDataInformation = useReactiveVar(
    rxWishlistDataInformation,
  );
  const getRxUserStoreCredit = useReactiveVar(rxUserStoreCredit);
  const getRxUserRewardPoint = useReactiveVar(rxUserRewardPoint);
  const mount = useRef();
  const {setDefautShippingToCart, setDefautBillingToCart} =
    useSelectShippingAddress();

  const [addWishlist] = useMutation(ADD_WISHLIST);
  const [removeWishlist] = useMutation(REMOVE_WISHLIST);

  const {
    data: fromNetwork,
    error,
    loading,
    dynamicVariables,
    onRefetchData: fetchItems,
    setDynamicSchemas,
    setDynamicVariables,
  } = useCustomQuery({
    isDynamicQuery: true,
    isDynamicVariables: true,
    configErr,
    opts: {fetchPolicy: 'network-only'},
  });

  /**
   * ---------------------------------------------------- *
   * @dependency []
   * @summary for intialize query
   * @summary for initialize schema
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    if (mount) {
      mount.current = true;
      if (mount.current) {
        setDynamicVariables(null);
        switch (type) {
          case TYPES.USER_INFO:
            setDynamicSchemas(GET_USER_INFO);
            break;
          case TYPES.USER_ADDRESS:
            setDynamicSchemas(GET_USER_ADDRESS);
            break;
          case TYPES.USER_ADDRESS_WITH_SET_CART_ADDRESS:
            setDynamicSchemas(GET_USER_ADDRESS);
            break;
          case TYPES.USER_WISHLIST_ITEM:
            setDynamicSchemas(GET_USER_WISHLIST_ITEM);
            break;
          case TYPES.USER_WISHLIST_INFORMATION:
            setDynamicSchemas(GET_USER_WISHLIST_INFORMATION);
            break;
          case TYPES.USER_STORE_CREDIT:
            setDynamicSchemas(GET_USER_STORE_CREDIT);
            break;
          case TYPES.USER_REWARD_POINT:
            setDynamicSchemas(GET_USER_REWARD_POINT);
            break;
        }

        if (initialized) {
          setDataResponse();
        }
      }
    }

    return () => (mount.current = false);
  }, []);

  /**
   * ---------------------------------------------------- *
   * @const {data}
   * @summary useMemo to filter spesific data
   * ---------------------------------------------------- *
   */
  const data = useMemo(() => {
    switch (type) {
      case TYPES.USER_INFO:
        return getRxUserInformation;
      case TYPES.USER_ADDRESS:
        return getRxUserAddresses;
      case TYPES.USER_ADDRESS_WITH_SET_CART_ADDRESS:
        return getRxUserAddresses;
      case TYPES.USER_WISHLIST_ITEM:
        return getRxUserWIshlistItems;
      case TYPES.USER_WISHLIST_INFORMATION:
        return getRxWishlistDataInformation;
      case TYPES.USER_STORE_CREDIT:
        return getRxUserStoreCredit;
      case TYPES.USER_REWARD_POINT:
        return getRxUserRewardPoint;
    }
  }, [
    type,
    fromNetwork,
    getRxUserInformation,
    getRxUserAddresses,
    getRxUserWIshlistItems,
    getRxWishlistDataInformation,
    getRxUserStoreCredit,
    getRxUserRewardPoint,
  ]);

  /**
   * ---------------------------------------------------- *
   * @function setCart
   * @param {params} object
   * @summary for set spesific data cart
   * ---------------------------------------------------- *
   */
  const setDataResponse = async (params, dataType = null) => {
    if (params) {
      const setDataType = type ? type : dataType;
      switch (setDataType) {
        case TYPES.USER_INFO:
          const userInfo = _.get(params, 'customer');
          if (userInfo) {
            rxUserInformation(userInfo);
          }
          break;
        case TYPES.USER_ADDRESS:
          const userAddress = _.get(params, 'customer.addresses');
          if (userAddress) {
            const parsedAddresses = parseAddress(userAddress);
            rxUserAddresses(parsedAddresses);
          }
          break;
        case TYPES.USER_ADDRESS_WITH_SET_CART_ADDRESS:
          const userAddressforCart = _.get(params, 'customer.addresses');
          if (userAddressforCart) {
            const parsedAddresses = parseAddress(userAddressforCart);
            rxUserAddresses(parsedAddresses);
            let shippingId = null;
            let billingId = null;
            userAddressforCart.map(async itemAddress => {
              const {default_shipping, default_billing, id} = itemAddress;
              if (default_shipping) {
                shippingId = id;
              }
              if (default_billing) {
                billingId = id;
              }
            });

            if (shippingId) {
              await setDefautShippingToCart(shippingId);
            }
            if (billingId) {
              await setDefautBillingToCart(billingId);
            }
          }
          break;
        case TYPES.USER_WISHLIST_ITEM:
          const wishlistItems =
            _.get(params, 'customer.wishlist.items_v2.items') ||
            _.get(params, 'wishlist.items_v2.items');
          if (wishlistItems) {
            const wishlistState = [];
            const wishlistInfo = {
              id:
                _.get(params, 'customer.wishlist.id') ||
                _.get(params, 'wishlist.id'),
              items_count:
                _.get(params, 'customer.wishlist.items_count') ||
                _.get(params, 'wishlist.items_count'),
            };
            wishlistItems?.map(item => {
              const {id, name, thumbnail, url_key, price_range} = item.product;
              wishlistState.push({
                wishlistId: item.id,
                productId: id,
                name: name,
                image: thumbnail?.url,
                url_key: url_key,
                price: price_range?.maximum_price?.final_price?.value,
                __typename: 'WishlistItem',
              });
            });
            rxUserWIshlistItems(wishlistState);
            rxWishlistDataInformation(wishlistInfo);
          } else {
            const isAnArray = _.isArray(params);
            if (isAnArray) {
              rxUserWIshlistItems(params);
            } else {
              const wishlistState =
                getRxUserWIshlistItems && getRxUserWIshlistItems.length > 0
                  ? [...getRxUserWIshlistItems]
                  : [];
              const product =
                params && params.product ? params?.product : params;
              const {id, name, thumbnail, url_key, price_range} = product;
              wishlistState.push({
                wishlistId: `${params.id}-local`,
                productId: id,
                name: name,
                image: thumbnail?.url,
                url_key: url_key,
                price: price_range?.maximum_price?.final_price?.value,
                __typename: 'WishlistItem',
              });

              rxUserWIshlistItems(wishlistState);
            }
          }
          break;
        case TYPES.USER_WISHLIST_INFORMATION:
          const wishlistInfo = _.get(params, 'wishlist');
          if (wishlistInfo) {
            rxWishlistDataInformation(wishlistInfo);
          }
          break;
        case TYPES.USER_REWARD_POINT:
          const dataRewardPoint = _.get(params, 'customerRewardPoints');
          if (dataRewardPoint) {
            rxUserRewardPoint(dataRewardPoint);
          }
          break;
        case TYPES.USER_STORE_CREDIT:
          const dataStoreCredit = _.get(params, 'customer.store_credit');
          if (dataStoreCredit) {
            rxUserStoreCredit(dataStoreCredit);
          }
          break;
      }
    } else {
      await fetchItems({params: dynamicVariables});
    }
  };

  const addToWishlist = async item => {
    if (getRxUserType === USER_CUSTOMER) {
      const wishID = 0;
      const sku = item?.product?.sku ?? item?.sku;
      let backupwishlistItems = [];
      if (getRxUserWIshlistItems && getRxUserWIshlistItems.length > 0) {
        backupwishlistItems = [...getRxUserWIshlistItems];
      }

      try {
        await setDataResponse(item, TYPES.USER_WISHLIST_ITEM);
        rxAppSnackbar({
          message: i18next.t('message.addToWishlist'),
        });
        const response = await addWishlist({
          variables: {
            wishlistId: wishID,
            wishlistItems: [{sku, quantity: 1}],
          },
        });

        const dataParams = _.get(response, 'data.addProductsToWishlist');
        await setDataResponse(dataParams, TYPES.USER_WISHLIST_ITEM);
        rxAppSnackbar({
          message: i18next.t('message.successAddToWishlist'),
        });
      } catch (err) {
        setDataResponse(backupwishlistItems, TYPES.USER_WISHLIST_ITEM);
        const ERROR = new ErrorHandler({err});
        ERROR.initHandleError();
      }
    }
  };

  const removeFromWishlist = async item => {
    const wishID = _.get(getRxWishlistDataInformation, 'id');
    const wishItemID = _.get(item, 'wishlistId');
    if (getRxUserType === USER_CUSTOMER && wishID) {
      let wishs = [];
      let backupwishlistItems = [];
      if (getRxUserWIshlistItems && getRxUserWIshlistItems.length > 0) {
        wishs = getRxUserWIshlistItems;
        backupwishlistItems = [...getRxUserWIshlistItems];
      }
      const tempWishlists = _.filter(wishs, function (obj) {
        return obj.wishlistId !== wishItemID;
      });

      setDataResponse(tempWishlists, TYPES.USER_WISHLIST_ITEM);
      rxAppSnackbar({
        message: i18next.t('message.removeWishlist'),
      });
      try {
        const response = await removeWishlist({
          variables: {
            wishlistId: wishID,
            wishlistItemsIds: [wishItemID],
          },
        });
        const dataParams = _.get(response, 'data.removeProductsFromWishlist');
        await setDataResponse(dataParams, TYPES.USER_WISHLIST_ITEM);
        rxAppSnackbar({
          message: i18next.t('message.successRemoveWishlist'),
        });
      } catch (err) {
        setDataResponse(backupwishlistItems, TYPES.USER_WISHLIST_ITEM);
        const ERROR = new ErrorHandler({err});
        ERROR.initHandleError();
      }
    }
  };

  useEffect(() => {
    const response = _.get(fromNetwork, 'data');
    if (type && response) {
      setDataResponse(response);
    }
  }, [fromNetwork, type]);

  return {
    data,
    error,
    loading,
    setDataResponse,
    addToWishlist,
    removeFromWishlist,
  };
};

export default useDataCustomer;
