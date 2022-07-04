import {useReactiveVar} from '@apollo/client';
import {
  SET_BILLING_ADDRESS,
  SET_SHIPPING_ADDRESS,
} from '@app/_modules/cart/services/schema';
import {
  rxCartIsVirtual,
  rxCartId,
  rxUserDefaultShippingAddressId,
} from '@app/services/cache';
import useCustomMutation from '@app/hooks/useCustomMutation';
import {
  BYPASS_ERROR_SELECT_SHIPPING_ADDRESS_SHIPPING,
  BYPASS_ERROR_SELECT_SHIPPING_ADDRESS_BILLING,
} from '@app/helpers/Constants';
import {onHandleError} from '@app/hooks/customer/useDataCustomer';

export function useSelectShippingAddress() {
  const getRxCartIsVirtual = useReactiveVar(rxCartIsVirtual);
  const getRxCartId = useReactiveVar(rxCartId);
  const {
    onRefetchData: selectShippingAddressHook,
    loading: loadingSetShipping,
  } = useCustomMutation({
    schema: SET_SHIPPING_ADDRESS,
    configErr: {
      logSource: BYPASS_ERROR_SELECT_SHIPPING_ADDRESS_SHIPPING,
      isBypass: true,
    },
  });
  const {onRefetchData: selectBillingAddressHook, loading: loadingSetBilling} =
    useCustomMutation({
      schema: SET_BILLING_ADDRESS,
      configErr: {
        logSource: BYPASS_ERROR_SELECT_SHIPPING_ADDRESS_BILLING,
        isBypass: true,
      },
    });
  //
  const setDefautShippingToCart = async addressId => {
    if (!getRxCartIsVirtual) {
      const gqlReturn = await selectShippingAddressHook({
        paramsOpt: {isReturn: true},
        params: {
          input: {
            cart_id: getRxCartId,
            shipping_addresses: [{customer_address_id: addressId}],
          },
        },
      });

      if (gqlReturn) {
        if (gqlReturn?.data?.setShippingAddressesOnCart) {
          rxUserDefaultShippingAddressId(addressId);
          // refetchCart(gqlReturn?.data?.setShippingAddressesOnCart);
        } else {
          onHandleError(gqlReturn);
        }
      }
      return gqlReturn;
    }
  };

  const setDefautBillingToCart = async addressId => {
    if (!getRxCartIsVirtual) {
      await selectBillingAddressHook({
        paramsOpt: {isReturn: true},
        params: {
          input: {
            cart_id: getRxCartId,
            billing_address: {customer_address_id: addressId},
          },
        },
      });
    }
  };

  const setShippingToCartGuestCheckout = async addressData => {
    if (!getRxCartIsVirtual) {
      try {
        await selectShippingAddressHook({
          paramsOpt: {isReturn: true},
          params: {
            input: {
              cart_id: getRxCartId,
              shipping_addresses: [{address: addressData}],
            },
          },
        });
      } catch (err) {
        onHandleError(err);
      }
    }
  };

  const setBillingToCartGuestCheckout = async addressData => {
    if (!getRxCartIsVirtual) {
      try {
        await selectBillingAddressHook({
          paramsOpt: {isReturn: true},
          params: {
            input: {
              cart_id: getRxCartId,
              billing_address: {address: addressData},
            },
          },
        });
      } catch (err) {
        onHandleError(err);
      }
    }
  };

  return {
    loadingSetShipping,
    loadingSetBilling,
    setDefautShippingToCart,
    setDefautBillingToCart,
    setShippingToCartGuestCheckout,
    setBillingToCartGuestCheckout,
  };
}
