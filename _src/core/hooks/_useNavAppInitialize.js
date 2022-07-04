import {useEffect, useRef} from 'react';
import {useReactiveVar} from '@apollo/client';
import {rxCartId, rxUserType} from '@app/services/cache';
import {
  USER_CUSTOMER,
  USER_GUEST,
  BYPASS_ERROR_APP_INITIAL_CART_ITEM,
  BYPASS_ERROR_APP_INITIAL_CART_PRICE,
  BYPASS_ERROR_APP_INITIAL_CUSTOMER,
} from '@app/helpers/Constants';
import crashlytics from '@react-native-firebase/crashlytics';
import DeviceInfo from 'react-native-device-info';
import useCarts, {TYPES} from '@app/hooks/carts/useCarts';
import {getStoredCartId} from '@app/hooks/carts/useCarts';
import {Storage} from '@app/helpers/Storage';
import useDataCustomer from '@app/hooks/customer/useDataCustomer';
import {TYPES as CUSTOMER_TYPES} from '@app/hooks/customer/useDataCustomer';
const useNavAppInitialize = () => {
  const getRxUserType = useReactiveVar(rxUserType);
  const getRxCartId = useReactiveVar(rxCartId);
  const mount = useRef();

  const {setDataResponse: getUserInfo} = useDataCustomer({
    initialized: false,
    type: CUSTOMER_TYPES.USER_INFO,
    configErr: {
      logSource: BYPASS_ERROR_APP_INITIAL_CUSTOMER,
      isBypass: true,
    },
  });
  const {setDataResponse: getUserAddress} = useDataCustomer({
    initialized: false,
    type: CUSTOMER_TYPES.USER_ADDRESS,
    configErr: {
      logSource: BYPASS_ERROR_APP_INITIAL_CUSTOMER,
      isBypass: true,
    },
  });
  const {setDataResponse: getWishlist} = useDataCustomer({
    initialized: false,
    type: CUSTOMER_TYPES.USER_WISHLIST_ITEM,
    configErr: {
      logSource: BYPASS_ERROR_APP_INITIAL_CUSTOMER,
      isBypass: true,
    },
  });
  const {setCart: getItems} = useCarts({
    initialized: false,
    type: TYPES.ITEM,
    configErr: {
      logSource: BYPASS_ERROR_APP_INITIAL_CART_ITEM,
      isBypass: true,
    },
  });
  const {setCart: getPrices} = useCarts({
    initialized: false,
    type: TYPES.PRICE,
    configErr: {
      logSource: BYPASS_ERROR_APP_INITIAL_CART_PRICE,
      isBypass: true,
    },
  });

  /**
   * ---------------------------------------------------- *
   * @function {lifecycle hooks}
   * @summary handling from hooks userType
   * store cart id from local to client
   * when customer fetch data customer
   * ---------------------------------------------------- *
   */
  useEffect(async () => {
    if (getRxUserType) {
      await getStoredCartId();
      if (getRxUserType === USER_CUSTOMER) {
        getUserInfo();
        getUserAddress();
        getWishlist();
      }
    } else {
      Storage.set(Storage.name.USER_TYPE, USER_GUEST);
      rxUserType(USER_GUEST);
    }
  }, [getRxUserType]);

  /**
   * ---------------------------------------------------- *
   * @function {lifecycle hooks}
   * @summary handling from hooks getRxCartId
   * when get cart id from server call API get items & prices
   * ---------------------------------------------------- *
   */
  useEffect(async () => {
    if (getRxCartId) {
      getItems();
      getPrices();
    }
  }, [getRxCartId]);

  /**
   * ---------------------------------------------------- *
   * @function {lifecycle}
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    mount.current = true;
    crashlytics().setUserId(DeviceInfo.getUniqueId());
    return () => (mount.current = false);
  }, []);

  return null;
};

export default useNavAppInitialize;
