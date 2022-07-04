import {useReactiveVar} from '@apollo/client';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {useEffect, useState} from 'react';
import {GET_CART as GET_CART_REMOTE} from '@app/_modules/cart/services/schema';
import {rxCartId, rxCartAvailablePaymentMethod} from '@app/services/cache';

export function useAvailablePaymentMethod() {
  const getRxCartId = useReactiveVar(rxCartId);
  const [cartParamsData, setCartParamsData] = useState(null);
  const [cartDataState, setCartDataState] = useState(null);

  const {onRefetchData: fetchCartDataRemote, data: cartDataRemote} =
    useCustomQuery({
      schema: GET_CART_REMOTE,
      opts: {fetchPolicy: 'network-only'},
    });

  const handleError = error => {
    if (error.graphQLErrors[0]) {
      const {category} = error.graphQLErrors[0].extensions;
      const {message} = error.graphQLErrors[0];
      if (
        category === 'graphql-authorization' &&
        message ===
          `The current user cannot perform operations on cart "${getRxCartId}"`
      ) {
        // resetCart();
      }

      if (
        category === 'graphql-no-such-entity' &&
        message === 'Current user does not have an active cart.'
      ) {
        // resetCart();
      }
    }
  };

  const refetch = async cartData => {
    if (cartData) {
      setCartParamsData(cartData);
    } else {
      try {
        await fetchCartDataRemote({
          params: {
            cartId: getRxCartId,
          },
        });
      } catch (error) {
        handleError(error);
        throw new Error(error);
      }
    }
  };

  useEffect(() => {
    if (cartParamsData) {
      return setCartDataState(cartParamsData);
    }
    if (cartDataRemote.data) {
      return setCartDataState(cartDataRemote.data);
    }
  }, [cartParamsData, cartDataRemote]);

  useEffect(() => {
    if (cartDataState && cartDataState?.cart) {
      rxCartAvailablePaymentMethod(
        cartDataState.cart?.available_payment_methods,
      );
    }
  }, [cartDataState]);

  return {refetch};
}
