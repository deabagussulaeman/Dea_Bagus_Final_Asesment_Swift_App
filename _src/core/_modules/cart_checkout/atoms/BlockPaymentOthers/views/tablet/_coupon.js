import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {FORM_FIELD} from '@app/helpers/Constants';
import {useReactiveVar} from '@apollo/client';
import {rxCartId} from '@app/services/cache';
import {TouchableRipple} from 'react-native-paper';
import {Colors} from '@app/styles';
import {
  APPLIED_COUPONS,
  REMOVED_COUPONS,
} from '@app/_modules/cart/services/schema';
import {CheckoutContext} from '@app/_modules/cart_checkout/_controller';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import Forms from '@app/components/_Forms';
import useCarts, {TYPES} from '@app/hooks/carts/useCarts';
import useCustomMutation from '@app/hooks/useCustomMutation';
import Show from '@app/components/Show';

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 0,
    marginBottom: 0,
  },
});

const CheckoutCouponCode = () => {
  const {t} = useTranslation();
  const getRxCartId = useReactiveVar(rxCartId);
  const ctxCheckout = useContext(CheckoutContext);
  const [dataCoupon, setDataCoupon] = useState({
    loading: false,
    isApplied: false,
    code: null,
  });
  const {onRefetchData: onAppliedCoupons} = useCustomMutation({
    schema: APPLIED_COUPONS,
  });
  const {onRefetchData: onRemovedCoupons} = useCustomMutation({
    schema: REMOVED_COUPONS,
  });
  const {data: getDataCoupon} = useCarts({
    initialized: true,
    type: TYPES.APPLIED_COUPON,
  });
  const {setCart: setDataPrice} = useCarts({
    initialized: false,
    type: TYPES.PRICE,
  });
  const {setCart: setAvailablePaymentMethod} = useCarts({
    initialized: false,
    type: TYPES.AVAILABLE_PAYMENT,
  });

  useEffect(() => {
    if (getDataCoupon !== null) {
      if (getDataCoupon?.length && getDataCoupon?.length > 0) {
        setDataCoupon({
          ...dataCoupon,
          isApplied: true,
          code: getDataCoupon[0]?.code,
        });
      }
    }
  }, [getDataCoupon]);

  const forms = [
    {
      name: 'couponCode',
      type: FORM_FIELD.INPUT,
      defaultValue: '',
      autoCapitalize: 'none',
      value: '',
      rules: {},
      //   themeInputCustom: {
      //     colors: {primary: 'green', underlineColor: 'transparent'},
      //   },
    },
  ];

  const onProcessCoupon = async data => {
    const cart_id = getRxCartId;
    const coupon_code = data?.couponCode;
    // applied coupon
    ctxCheckout?.setIsCart({
      ...ctxCheckout?.isCart,
      loadingButtonOrder: true,
    });

    if (coupon_code !== '' && !dataCoupon?.isApplied) {
      try {
        setDataCoupon({...dataCoupon, loading: true});
        const res = await onAppliedCoupons({
          paramsOpt: {isReturn: true},
          params: {
            input: {cart_id, coupon_code},
          },
        });
        if (res?.data) {
          setDataCoupon({loading: false, isApplied: true, code: coupon_code});
          setDataPrice();
          setAvailablePaymentMethod();
        } else {
          setDataCoupon({...dataCoupon, loading: false});
        }

        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          loadingButtonOrder: false,
        });
      } catch (err) {
        console.log('[err] applied coupon', err);
        setDataCoupon({...dataCoupon, loading: false});
        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          loadingButtonOrder: false,
        });
      }
      // remove coupon
    } else {
      try {
        setDataCoupon({...dataCoupon, loading: true});
        const res = await onRemovedCoupons({
          paramsOpt: {isReturn: true},
          params: {
            input: {cart_id},
          },
        });
        if (res) {
          setDataCoupon({loading: false, isApplied: false, code: null});
          setDataPrice();
          setAvailablePaymentMethod();
        } else {
          setDataCoupon({...dataCoupon, loading: false});
        }

        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          loadingButtonOrder: false,
        });
      } catch (err) {
        console.log('[err] applied coupon', err);
        setDataCoupon({...dataCoupon, loading: false});
        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          loadingButtonOrder: false,
        });
      }
    }
  };
  return (
    <Section marginTop={15}>
      <Show when={!dataCoupon?.isApplied}>
        <Label bold>{t('cart_checkout.label.couponCode')}</Label>
        <Forms
          fields={forms}
          buttonTitle={t('apply')}
          onSubmit={onProcessCoupon}
          loading={dataCoupon.loading}
          formContainerStyle={styles.formContainer}
        />
      </Show>
      <Show when={dataCoupon?.isApplied}>
        <Section row>
          <Label>{dataCoupon?.code}</Label>
          <TouchableRipple
            onPress={
              ctxCheckout?.isCart?.loadingButtonOrder
                ? () => {}
                : () => onProcessCoupon()
            }
            disabled={ctxCheckout?.isCart?.loadingButtonOrder}>
            <Section marginLeft={5}>
              <Label bold underline color={Colors.PRIMARY}>
                {t('remove')}
              </Label>
            </Section>
          </TouchableRipple>
        </Section>
      </Show>
    </Section>
  );
};

export default CheckoutCouponCode;
