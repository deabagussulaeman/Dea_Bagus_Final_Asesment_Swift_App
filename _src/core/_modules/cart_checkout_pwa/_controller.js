import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useReactiveVar} from '@apollo/client';
import {rxCartId, rxUserToken} from '@app/services/cache';
import {getPwaUrl} from '@app/helpers/Checkout';
import Views from '@app/_modules/cart_checkout_pwa/views';

const CheckoutPwaController = props => {
  const mount = useRef();
  const webviewRef = useRef();
  const isFocused = useIsFocused();
  const getRxCartId = useReactiveVar(rxCartId);
  const getRxUserToken = useReactiveVar(rxUserToken);
  const [pwaUrl, setPwaUrl] = useState(null);

  useEffect(() => {
    mount.current = true;
    if (mount.current) {
      const getPwaUrlFinal = getPwaUrl({
        token: getRxUserToken,
        cartId: getRxCartId,
      });
      console.log(getPwaUrlFinal);
      setPwaUrl(getPwaUrlFinal);
      webviewRef.current.reload();
    }
    return () => (mount.current = false);
  }, [isFocused]);
  /**
   * ---------------------------------------------------- *
   * @constant controllerProps
   * @return {object}
   * ---------------------------------------------------- *
   */
  const controllerProps = {
    pwaUrl,
    webviewRef,
  };

  return <Views {...props} {...controllerProps} />;
};

export default CheckoutPwaController;
