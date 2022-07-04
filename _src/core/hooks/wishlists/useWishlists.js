import {useEffect, useMemo, useRef} from 'react';
import {useReactiveVar, useMutation} from '@apollo/client';
import {
  rxUserWIshlistItems,
  rxUserType,
  rxWishlistDataInformation,
  rxAppSnackbar,
} from '@app/services/cache';
import wishlistSchema from '@app/hooks/wishlists/schema';
import useCustomQuery from '@app/hooks/useCustomQuery';
import _ from 'lodash';
import i18next from 'i18next';

export const TYPES = {
  INFORMATION: 'INFORMATION',
  ITEM: 'ITEM',
};

const useWishlists = ({initialized = false, type = TYPES.ITEM}) => {
  const mount = useRef();
  const {
    data: fromNetwork,
    error,
    loading,
    onRefetchData: fetchItems,
    setDynamicSchemas,
  } = useCustomQuery({
    isDynamicQuery: true,
    isDynamicVariables: false,
  });

  const getRxUserType = useReactiveVar(rxUserType);
  const getRxUserWIshlistItems = useReactiveVar(rxUserWIshlistItems);
  const getRxWishlistDataInformation = useReactiveVar(
    rxWishlistDataInformation,
  );

  const {add, remove, get, getInformation} = wishlistSchema();

  const [addItem] = useMutation(add);
  const [removeItem] = useMutation(remove);

  useEffect(() => {
    if (mount) {
      mount.current = true;
      if (mount.current) {
        switch (type) {
          case TYPES.ITEM:
            setDynamicSchemas(get);
            break;
          case TYPES.INFORMATION:
            setDynamicSchemas(getInformation);
            break;
          default:
            setDynamicSchemas(get);
            break;
        }

        if (initialized === true) {
          setWishlist();
        }
      }
    }

    return () => (mount.current = false);
  }, []);

  const data = useMemo(() => {
    switch (type) {
      case TYPES.ITEM:
        return getRxUserWIshlistItems;
      case TYPES.INFORMATION:
        return getRxWishlistDataInformation;
      default:
        return getRxUserWIshlistItems;
    }
  }, [fromNetwork, getRxUserWIshlistItems, getRxWishlistDataInformation, type]);

  const setWishlist = async params => {
    if (params) {
      switch (type) {
        case TYPES.ITEM:
          const wishlistItems = _.get(params, 'wishlist.items_v2.items');
          if (wishlistItems) {
            const wishlistState = [];
            wishlistItems?.map(item => {
              const {id, name, thumbnail, url_key, price_range} = item.product;
              wishlistState.push({
                wishlistId: item.id,
                productId: id,
                name: name,
                image: thumbnail.url,
                url_key: url_key,
                price: price_range.maximum_price.final_price.value,
                __typename: 'WishlistItem',
              });
            });
            rxUserWIshlistItems(wishlistState);
          } else {
            const isAnArray = _.isArray(params);
            if (isAnArray) {
              rxUserWIshlistItems(params);
            } else {
              const wishlistState =
                getRxUserWIshlistItems && getRxUserWIshlistItems.length > 0
                  ? [...getRxUserWIshlistItems]
                  : [];
              const {id, name, thumbnail, url_key, price_range} =
                params.product;
              wishlistState.push({
                wishlistId: params.id,
                productId: id,
                name: name,
                image: thumbnail.url,
                url_key: url_key,
                price: price_range.maximum_price.final_price.value,
                __typename: 'WishlistItem',
              });

              rxUserWIshlistItems(wishlistState);
            }
          }
          break;
        case TYPES.INFORMATION:
          const wishlistInfo = _.get(params, 'wishlist');
          if (wishlistInfo) {
            rxWishlistDataInformation(wishlistInfo);
          }
          break;
        default:
          const wishlistItem = _.get(params, 'wishlist.items_v2.items');
          if (wishlistItem) {
            rxUserWIshlistItems(wishlistItem);
          }
          break;
      }
    } else {
      await fetchItems({params: null});
    }
  };

  const addToWishlist = async item => {
    const wishID = _.get(getRxWishlistDataInformation, 'id');
    if (getRxUserType === 'customer' && wishID) {
      const {sku} = item.product;
      try {
        await setWishlist(item);
        rxAppSnackbar({
          message: i18next.t('message.addToWishlist'),
        });
        const response = await addItem({
          variables: {
            wishlistId: wishID,
            wishlistItems: [{sku, quantity: 1}],
          },
        });

        const dataParams = _.get(response, 'data.addProductsToWishlist');

        await setWishlist(dataParams);
      } catch (err) {
        rxAppSnackbar({
          message: i18next.t('error.cart'),
        });
      }
    }
  };

  const removeFromWishlist = async item => {
    const wishID = _.get(getRxWishlistDataInformation, 'id');
    const wishItemID = _.get(item, 'wishlistId');
    if (getRxUserType === 'customer' && wishID) {
      const wishs =
        getRxUserWIshlistItems && getRxUserWIshlistItems.length > 0
          ? [...getRxUserWIshlistItems]
          : [];
      const tempWishlists = _.filter(wishs, function (obj) {
        return obj.wishlistId !== wishItemID;
      });
      setWishlist(tempWishlists);
      rxAppSnackbar({
        message: i18next.t('message.removeWishlist'),
      });
      try {
        const response = await removeItem({
          variables: {
            wishlistId: wishID,
            wishlistItemsIds: [wishItemID],
          },
        });
        const dataParams = _.get(response, 'data.removeProductsFromWishlist');
        await setWishlist(dataParams);
      } catch (err) {
        console.log(err);
        rxAppSnackbar({
          message: i18next.t('error.cart'),
        });
      }
    }
  };

  useEffect(() => {
    const responseNetwork = _.get(fromNetwork, 'data.customer');
    if (responseNetwork) {
      setWishlist(responseNetwork);
    }
  }, [fromNetwork, type]);

  return {data, loading, error, addToWishlist, removeFromWishlist};
};

export default useWishlists;
