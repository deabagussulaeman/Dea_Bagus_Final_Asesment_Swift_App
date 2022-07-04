import React, {useState, useEffect, createContext, useRef} from 'react';
import useCarts, {
  TYPES,
  onClearAllDataCart,
  getCheckoutSessionToken,
} from '@app/hooks/carts/useCarts';
import {Linking} from 'react-native';
import {useReactiveVar} from '@apollo/client';
import {modules, tabsApp} from '@root/swift.config';
import {useTranslation} from 'react-i18next';
import {navReset} from '@app/helpers/Navigation';
import {useForm} from 'react-hook-form';
import {useFormConfig} from '@app/components/_Forms';
import {
  CONTAIN_SNAP,
  PREFIX_AIRPAY,
  PREFIX_GOJEK,
  PREFIX_SHOPEE,
  PREFIX_SHOPEEID,
  USER_GUEST,
  IS_FREE,
} from '@app/helpers/Constants';
import {
  PLACE_ORDER,
  GET_SNAP_TOKEN,
  GET_SNAP_STATUS,
} from '@app/_modules/cart/services/schema';
import {
  rxUserType,
  rxCartExtraFee,
  rxCartAppliedStoreCredit,
  rxCartGiftCard,
  rxUserAddresses,
  rxCartShipping,
  rxAppSnackbar,
  rxCartId,
  rxCartSelectedPaymentMethod,
  rxCartSnapUrl,
  rxCartOrderId,
  rxAppLoading,
  rxCartAvailablePaymentMethod,
} from '@app/services/cache';
import Config from 'react-native-config';
import Views from '@app/_modules/cart_checkout/views';
import useStoreConfig from '@app/hooks/useStoreConfig';
import useCustomQuery from '@app/hooks/useCustomQuery';
import useCustomMutation from '@app/hooks/useCustomMutation';
import _ from 'lodash';
import {checkoutSession} from '@root/swift.config';

export const CheckoutContext = createContext();

const CartCheckout = () => {
  if (!modules.cart_checkout.enable) {
    return null;
  }

  const useFormExternal = useForm(useFormConfig);
  const {storeConfig: getCoreConfig} = useStoreConfig({useInitData: true});
  const {onRefetchData: onPlaceOrderHook, loading: isLoadingPlaceOrder} =
    useCustomMutation({
      schema: PLACE_ORDER,
    });
  const {onRefetchData: onRefetchSnapToken} = useCustomQuery({
    schema: GET_SNAP_TOKEN,
    initialized: false,
  });
  const {onRefetchData: onRefetchSnapStatus} = useCustomQuery({
    schema: GET_SNAP_STATUS,
    useInitData: false,
  });
  const {data: items, isEmptyCart} = useCarts({
    initialized: true,
    type: TYPES.ITEM,
  });
  const {data: prices} = useCarts({
    initialized: true,
    type: TYPES.PRICE,
  });
  const {data: getCartRewardPoints} = useCarts({
    initialized: true,
    type: TYPES.APPLIED_REWARD_POINT,
  });

  /**
   * ----------------------------------------- *
   * @const {reactive variable}
   * @summary reactive variable collection
   * ----------------------------------------- *
   */
  const {t} = useTranslation();
  const [expand, setExpand] = useState(false);
  const [isLoadingSnap, setIsLoadingSnap] = useState(true);
  const [isCart, setIsCart] = useState({
    selectedShippingAddress: false,
    selectedShippingMethod: false,
    selectedPaymentMethod: false,
    getEditAddress: false,
    getReviewOrder: false,
    getCouponCode: null,
    getGiftCard: null,
    showSnap: false,
    loadingButtonOrder: false,
  });

  const getRxCartId = useReactiveVar(rxCartId);
  const getRxUserType = useReactiveVar(rxUserType);
  const getRxDataExtraFee = useReactiveVar(rxCartExtraFee);
  const getRxDataAppliedStoreCredit = useReactiveVar(rxCartAppliedStoreCredit);
  const getRxAppliedGiftCard = useReactiveVar(rxCartGiftCard);
  const getRxUserAddresses = useReactiveVar(rxUserAddresses);
  const getRxActiveSections = useReactiveVar(rxCartShipping);
  const getRxCartOrderId = useReactiveVar(rxCartOrderId);
  const getRxCartSelectedPaymentMethod = useReactiveVar(
    rxCartSelectedPaymentMethod,
  );
  const getRxCartAvailablePaymentMethod = useReactiveVar(
    rxCartAvailablePaymentMethod,
  );
  const isGuest = getRxUserType === USER_GUEST;
  const mount = useRef();
  const getIsSnapProduction = _.get(getCoreConfig, 'snap_is_production');
  const getSnapUrl = Number(getIsSnapProduction)
    ? Config.SNAP_PROD
    : Config.SNAP_DEV;

  /**
   * ---------------------------------------------------- *
   * @dependency []
   * @summary for clear timeout ref for place order
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    mount.current = true;
    if (checkoutSession.enable) {
      getCheckoutSessionToken();
    }

    return () => {
      mount.current = false;
    };
  }, []);

  useEffect(() => {}, [getRxCartOrderId]);

  /**
   * ---------------------------------------------------- *
   * @function onPressExpand
   * @summary for expand price
   * ---------------------------------------------------- *
   */
  const onPressExpand = () => setExpand(!expand);

  /**
   * ---------------------------------------------------- *
   * @function _onSnapCheckMidtransStatus
   * @summary for checking midtrans status
   * ---------------------------------------------------- *
   */
  const _onSnapCheckMidtransStatus = async () => {
    setIsCart({...isCart, showSnap: false});
    try {
      rxAppLoading(true);
      const res = await onRefetchSnapStatus({
        paramsOpt: {isReturn: true},
        params: {
          orderId: getRxCartOrderId,
        },
      });
      if (res) {
        const isSuccess =
          _.get(res, 'data.getSnapOrderStatusByOrderId.success') === 'true';
        const message = _.get(
          res,
          'data.getSnapOrderStatusByOrderId.status_message',
        );
        if (isSuccess) {
          onClearAllDataCart();
          rxAppLoading(false);
          navReset(modules.cart_thankyou.name);
        } else {
          rxAppSnackbar({message});
          rxAppLoading(false);
          navReset(tabsApp.name);
        }
      }
    } catch (err) {
      console.log('[err] check midtrans status', err);
      rxAppSnackbar({message: err.toString()});
      rxAppLoading(false);
      navReset(modules.cart_thankyou.name);
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function _onSnapNavigationStateChange especially for webview
   * @summary for checking url for redirect
   * ---------------------------------------------------- *
   */
  const _onSnapNavigationStateChange = async webViewState => {
    const url = webViewState.url;
    const isBlank = url.startsWith('about:blank');
    const isSnapUrl = url.startsWith(getSnapUrl);
    const isEWalletDeeplink =
      url.startsWith(PREFIX_GOJEK) ||
      url.startsWith(PREFIX_SHOPEE) ||
      url.includes(PREFIX_SHOPEEID) ||
      url.includes(PREFIX_AIRPAY);

    if (!isBlank && !isSnapUrl) {
      _onSnapCheckMidtransStatus();
      return;
    }
    if (isEWalletDeeplink) {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        setIsCart({...isCart, showSnap: false});
        navReset(modules.cart_thankyou.name);
        await Linking.openURL(url);
      } else {
        rxAppSnackbar({message: t('cart_checkout.error.appNotInstalled')});
        setIsCart({...isCart, showSnap: false});
      }
      return;
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function _onSnapModalClose
   * @summary on snap modal close event
   * ---------------------------------------------------- *
   */
  const _onSnapModalClose = () => {
    setIsCart({...isCart, showSnap: false});
    _onSnapCheckMidtransStatus();
  };

  /**
   * ---------------------------------------------------- *
   * @function _onSnapModalLoad
   * @summary on snap modal load for page finish
   * loader stop
   * ---------------------------------------------------- *
   */
  const _onSnapModalLoad = () => {
    setIsLoadingSnap(false);
  };

  /**
   * ---------------------------------------------------- *
   * @function _onSnapModalError
   * @summary for snap modal error handling
   * ---------------------------------------------------- *
   */
  const _onSnapModalError = () => syntheticEvent => {
    const code = _.get(syntheticEvent, 'nativeEvent.code');
    const message = _.get(syntheticEvent, 'nativeEvent.description');
    rxAppSnackbar({message});
    if (code === -2) {
      setIsCart({...isCart, showSnap: false});
      navReset(modules.cart_thankyou.name);
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function _onGetSnapMidtransRedirectUrl
   * @summary on get snap midtrans redirect url
   * ---------------------------------------------------- *
   */
  const _onGetSnapMidtransRedirectUrl = async (orderId, isFree) => {
    try {
      if (!isFree) {
        const res = await onRefetchSnapToken({
          paramsOpt: {isReturn: true},
          params: {orderId},
        });
        if (res) {
          const getSnapRedirectUrl = _.get(
            res,
            'data.getSnapTokenByOrderId.redirect_url',
          );
          rxCartSnapUrl(getSnapRedirectUrl);
        }
      }
      rxCartOrderId(orderId);
    } catch (err) {
      console.log('[err] get snap midtrans redirect url', err);
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function onProcessPlaceOrder
   * @summary for process place order review order
   * or open midtrans for place order
   * ---------------------------------------------------- *
   */
  const onProcessPlaceOrder = async () => {
    const isFree = _.countBy(
      getRxCartAvailablePaymentMethod,
      item => item.code === IS_FREE,
    ).true;

    if (!isCart?.selectedShippingAddress) {
      rxAppSnackbar({
        message: t('cart_checkout.selectShippingAddress'),
      });
      return;
    }

    if (!isCart?.selectedShippingMethod) {
      rxAppSnackbar({
        message: t('cart_checkout.selectShippingMethod'),
      });
      return;
    }

    if (!isCart?.selectedPaymentMethod && !isFree) {
      rxAppSnackbar({
        message: t('cart_checkout.error.selectPaymentMethod'),
      });
      return;
    }

    /* can't process place order */
    if (
      !isCart.selectedPaymentMethod &&
      getRxCartSelectedPaymentMethod === null
    ) {
      rxAppSnackbar({
        message: t('cart_checkout.error.selectPaymentMethod'),
      });
      return;
    }

    /* process place order */
    try {
      const cart_id = getRxCartId;
      const res = await onPlaceOrderHook({
        paramsOpt: {isReturn: true},
        params: {
          input: {cart_id},
        },
      });
      if (res) {
        const order_number = _.get(res, 'data.placeOrder.order.order_number');
        if (!order_number) {
          rxAppSnackbar({message: res.toString()});
          return;
        }
        _onGetSnapMidtransRedirectUrl(order_number, isFree);
        const isCanSnapShow =
          getRxCartSelectedPaymentMethod?.code?.indexOf(CONTAIN_SNAP) !== -1;
        if (isCanSnapShow) {
          setIsCart({...isCart, showSnap: true});
        } else {
          navReset(modules.cart_thankyou.name);
        }
      }
    } catch (err) {
      console.log('[err] place order', err);
    }
  };

  /**
   * ---------------------------------------------------- *
   * @const {ctxProps}
   * @summary for context passing data to children
   * ---------------------------------------------------- *
   */
  const ctxProps = {
    isCart,
    setIsCart,
    useFormExternal,
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
    expand,
    isGuest,
    isEmptyCart,
    isLoadingSnap,
    userAddresses: getRxUserAddresses,
    activeSections: getRxActiveSections,
    dataExtraFee: getRxDataExtraFee,
    dataAppliedStoreCredit: getRxDataAppliedStoreCredit,
    appliedGiftCard: getRxAppliedGiftCard,
    appliedRewardPoints: getCartRewardPoints,
    cart: items,
    dataPrices: prices,
    userType: getRxUserType,
    isLoadingPlaceOrder,
    onPressExpand,
    onProcessPlaceOrder,
    _onSnapModalLoad,
    _onSnapModalClose,
    _onSnapModalError,
    _onSnapNavigationStateChange,
  };

  return (
    <CheckoutContext.Provider value={ctxProps}>
      <Views {...controllerProps} />
    </CheckoutContext.Provider>
  );
};

export default CartCheckout;
