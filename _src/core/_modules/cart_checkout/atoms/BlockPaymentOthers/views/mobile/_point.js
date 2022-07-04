import React, {useState, useEffect, useContext} from 'react';
import useCarts, {TYPES} from '@app/hooks/carts/useCarts';
import useDataCustomer, {
  TYPES as TYPES_USER,
} from '@app/hooks/customer/useDataCustomer';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {getErrorGQL, numberFormat} from '@app/helpers/General';
import {TouchableRipple} from 'react-native-paper';
import {Colors} from '@app/styles';
import {useReactiveVar} from '@apollo/client';
import {rxAppSnackbar, rxCartId, rxUserTheme} from '@app/services/cache';
import {
  APPLIED_STORE_CREDIT,
  APPLY_REWARD_POINTS,
  REMOVED_REWARD_POINTS,
  REMOVED_STORE_CREDIT,
} from '@app/_modules/cart/services/schema';
import {CheckoutContext} from '@app/_modules/cart_checkout/_controller';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import useCustomMutation from '@app/hooks/useCustomMutation';
import _ from 'lodash';

const styles = StyleSheet.create({
  btnApply: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 30,
  },
  btnApplyRemove: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 2,
  },
});

const CheckoutMyPoint = () => {
  const {t} = useTranslation();
  const getRxCartId = useReactiveVar(rxCartId);
  const ctxCheckout = useContext(CheckoutContext);
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const btnApplyStyle =
    getRxUserTheme === 'dark'
      ? {backgroundColor: Colors.WHITE, borderColor: Colors.WHITE}
      : {backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY};
  const btnApplyRemoveStyle =
    getRxUserTheme === 'dark'
      ? {backgroundColor: Colors.DARK, borderColor: Colors.WHITE}
      : {backgroundColor: Colors.WHITE, borderColor: Colors.PRIMARY};
  const btnApplyTextColor =
    getRxUserTheme === 'dark' ? Colors.BLACK : Colors.WHITE;
  const btnApplyRemoveTextColor =
    getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY;
  /* REWARD POINT */
  const [getDataPoint, setGetDataPoint] = useState({
    loading: false,
    isError: false,
    isApplied: false,
  });
  const {setCart: setAvailablePaymentMethod} = useCarts({
    initialized: false,
    type: TYPES.AVAILABLE_PAYMENT,
  });
  const {data: getCartRewardPoints, setCart: setRewardPoints} = useCarts({
    initialized: true,
    type: TYPES.APPLIED_REWARD_POINT,
  });
  const {data: getRewardPoints} = useDataCustomer({
    initialized: true,
    type: TYPES_USER.USER_REWARD_POINT,
  });
  const {onRefetchData: onApplyRewardPoints} = useCustomMutation({
    schema: APPLY_REWARD_POINTS,
  });
  const {onRefetchData: onRemoveRewardPoints} = useCustomMutation({
    schema: REMOVED_REWARD_POINTS,
  });

  /* STORE CREDIT */
  const [getDataCredit, setGetDataCredit] = useState({
    loading: false,
    isError: false,
    isApplied: false,
  });
  const {data: getCartStoreCredit} = useCarts({
    initialized: true,
    type: TYPES.APPLIED_STORE_CREDIT,
  });

  const {data: getStoreCredit} = useDataCustomer({
    initialized: true,
    type: TYPES_USER.USER_STORE_CREDIT,
  });
  const {onRefetchData: onAppliedStoreCredit} = useCustomMutation({
    schema: APPLIED_STORE_CREDIT,
  });
  const {onRefetchData: onRemoveStoreCredit} = useCustomMutation({
    schema: REMOVED_STORE_CREDIT,
  });
  const {setCart: setDataPrice} = useCarts({
    initialized: false,
    type: TYPES.PRICE,
  });

  /**
   * ---------------------------------------------------- *
   * @dependency [getCartRewardPoints]
   * @summary for set is use store credit
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    if (getCartRewardPoints?.is_use_reward_points) {
      setGetDataPoint({
        ...getDataPoint,
        isApplied: getCartRewardPoints?.is_use_reward_points,
      });
    }
  }, [getCartRewardPoints]);

  /**
   * ---------------------------------------------------- *
   * @dependency [getCartStoreCredit]
   * @summary for set is use store credit
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    if (getCartStoreCredit?.is_use_store_credit) {
      setGetDataCredit({
        ...getDataCredit,
        isApplied: getCartStoreCredit?.is_use_store_credit,
      });
    }
  }, [getCartStoreCredit]);

  /**
   * ---------------------------------------------------- *
   * @function onProcessRewardPoint
   * @summary on process for reward point
   * ---------------------------------------------------- *
   */
  const onProcessRewardPoint = async () => {
    const cart_id = getRxCartId;

    ctxCheckout?.setIsCart({
      ...ctxCheckout?.isCart,
      loadingButtonOrder: true,
    });

    if (!getDataPoint.isApplied) {
      try {
        const res = await onApplyRewardPoints({
          paramsOpt: {isReturn: true},
          params: {
            input: {cart_id},
          },
        });

        const getError = getErrorGQL(res);
        if (getError.isError) {
          ctxCheckout?.setIsCart({
            ...ctxCheckout?.isCart,
            loadingButtonOrder: false,
          });
          rxAppSnackbar({message: getError?.message});
          return;
        }
        if (res?.data) {
          setDataPrice(_.get(res, 'data.applyRewardPointsToCart.cart'));
          setRewardPoints(_.get(res, 'data.applyRewardPointsToCart.cart'));
          setAvailablePaymentMethod();
          setGetDataPoint({
            ...getDataPoint,
            isApplied: true,
          });
        }
        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          loadingButtonOrder: false,
        });
      } catch (err) {
        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          loadingButtonOrder: false,
        });
        console.log('[err] apply reward point', err);
      }
    } else {
      try {
        const res = await onRemoveRewardPoints({
          paramsOpt: {isReturn: true},
          params: {
            input: {cart_id},
          },
        });
        const getError = getErrorGQL(res);
        if (getError.isError) {
          ctxCheckout?.setIsCart({
            ...ctxCheckout?.isCart,
            loadingButtonOrder: false,
          });
          rxAppSnackbar({message: getError?.message});
          return;
        }
        if (res?.data) {
          setDataPrice(_.get(res, 'data.removeRewardPointsFromCart.cart'));
          setRewardPoints(_.get(res, 'data.applyRewardPointsToCart.cart'));
          setAvailablePaymentMethod();
          setGetDataPoint({
            ...getDataPoint,
            isApplied: false,
          });
          ctxCheckout?.setIsCart({
            ...ctxCheckout?.isCart,
            loadingButtonOrder: false,
          });
        }
      } catch (err) {
        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          loadingButtonOrder: false,
        });
        console.log('[err] remove reward point', err);
      }
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function onProcessStoreCredit
   * @summary on process for store credit
   * ---------------------------------------------------- *
   */
  const onProcessStoreCredit = async () => {
    const cart_id = getRxCartId;
    ctxCheckout?.setIsCart({
      ...ctxCheckout?.isCart,
      loadingButtonOrder: true,
    });

    if (!getDataCredit.isApplied) {
      try {
        const res = await onAppliedStoreCredit({
          paramsOpt: {isReturn: true},
          params: {
            input: {cart_id},
          },
        });
        const getError = getErrorGQL(res);
        if (getError.isError) {
          ctxCheckout?.setIsCart({
            ...ctxCheckout?.isCart,
            loadingButtonOrder: false,
          });
          rxAppSnackbar({message: getError?.message});
          return;
        }
        if (res?.data) {
          setDataPrice(_.get(res, 'data.applyStoreCreditToCart.cart'));
          setAvailablePaymentMethod();
          setGetDataCredit({
            ...getDataCredit,
            isApplied: true,
          });
          ctxCheckout?.setIsCart({
            ...ctxCheckout?.isCart,
            loadingButtonOrder: false,
          });
        }
      } catch (err) {
        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          loadingButtonOrder: false,
        });
        console.log('[err] apply store credit', err);
      }
    } else {
      try {
        const res = await onRemoveStoreCredit({
          paramsOpt: {isReturn: true},
          params: {
            input: {cart_id},
          },
        });
        const getError = getErrorGQL(res);
        if (getError.isError) {
          ctxCheckout?.setIsCart({
            ...ctxCheckout?.isCart,
            loadingButtonOrder: false,
          });
          rxAppSnackbar({message: getError?.message});
          return;
        }
        if (res?.data) {
          setDataPrice(_.get(res, 'data.removeStoreCreditFromCart.cart'));
          setAvailablePaymentMethod();
          setGetDataCredit({
            ...getDataCredit,
            isApplied: false,
          });
          ctxCheckout?.setIsCart({
            ...ctxCheckout?.isCart,
            loadingButtonOrder: false,
          });
        }
      } catch (err) {
        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          loadingButtonOrder: false,
        });
        console.log('[err] remove store credit', err);
      }
    }
  };

  return (
    <Section>
      {/* MY POINT */}
      <Section row marginTop={20}>
        <Section width={'50%'}>
          <Label>{t('cart_checkout.label.myPoint')}</Label>
          <Label>
            {'('}
            {getDataPoint.isApplied
              ? `${t('cart_checkout.label.point')} ${
                  getCartRewardPoints?.reward_points_amount
                }`
              : numberFormat({
                  value: getRewardPoints?.formatedBalanceCurrency,
                  decimals: 0,
                })}
            {')'}
          </Label>
        </Section>
        <Section width={'50%'}>
          <TouchableRipple
            style={
              getDataPoint.isApplied
                ? [styles.btnApplyRemove, btnApplyRemoveStyle]
                : [styles.btnApply, btnApplyStyle]
            }
            onPress={
              ctxCheckout?.isCart?.loadingButtonOrder
                ? () => {}
                : () => onProcessRewardPoint()
            }>
            <Label
              bold
              color={
                getDataPoint.isApplied
                  ? btnApplyRemoveTextColor
                  : btnApplyTextColor
              }>
              {getDataPoint.isApplied ? t('remove') : t('apply')}
            </Label>
          </TouchableRipple>
        </Section>
      </Section>
      {/* STORE CREDIT */}
      <Section row marginTop={20}>
        <Section width={'50%'}>
          <Label>{t('cart_checkout.label.storeCredit')}</Label>
          <Label>
            (
            {getDataCredit?.isApplied
              ? numberFormat({
                  value: getCartStoreCredit?.store_credit_amount,
                  decimals: 0,
                })
              : numberFormat({
                  value: getStoreCredit?.current_balance?.value,
                  decimals: 0,
                })}
            )
          </Label>
        </Section>
        <Section width={'50%'}>
          <TouchableRipple
            style={
              getDataCredit.isApplied
                ? [styles.btnApplyRemove, btnApplyRemoveStyle]
                : [styles.btnApply, btnApplyStyle]
            }
            onPress={
              ctxCheckout?.isCart?.loadingButtonOrder
                ? () => {}
                : () => onProcessStoreCredit()
            }
            disabled={ctxCheckout?.isCart?.loadingButtonOrder}>
            <Label
              bold
              color={
                getDataCredit.isApplied
                  ? btnApplyRemoveTextColor
                  : btnApplyTextColor
              }>
              {getDataCredit.isApplied ? t('remove') : t('apply')}
            </Label>
          </TouchableRipple>
        </Section>
      </Section>
    </Section>
  );
};

export default CheckoutMyPoint;
