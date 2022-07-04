import React, {useState, useContext, useEffect} from 'react';
import {
  rxCartAvailablePaymentMethod,
  rxCartId,
  rxCartSelectedPaymentMethod,
  rxUserTheme,
} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import {StyleSheet} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import {Colors} from '@app/styles';
import {useTranslation} from 'react-i18next';
import {SET_PAYMENT_METHOD} from '@app/_modules/cart/services/schema';
import {IS_FREE, PAYMENT_METHOD} from '@app/helpers/Constants';
import {CheckoutContext} from '@app/_modules/cart_checkout/_controller';

import crashlytics from '@react-native-firebase/crashlytics';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import RadioButton from '@app/components/RadioButton';
import Show from '@app/components/Show';
import Divider from '@app/components/Divider';
import useCustomMutation from '@app/hooks/useCustomMutation';
import _ from 'lodash';

const styles = StyleSheet.create({
  paymentItem: {
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingVertical: 10,
  },
});
const BlockPaymentMethod = () => {
  const {t} = useTranslation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const getRxCartSelectedPayment = useReactiveVar(rxCartSelectedPaymentMethod);
  const {
    onRefetchData: selectPaymentMethodHook,
    loading: isLoadingSelectPaymentMethod,
  } = useCustomMutation({
    schema: SET_PAYMENT_METHOD,
  });

  const ctxCheckout = useContext(CheckoutContext);
  const getRxCartId = useReactiveVar(rxCartId);
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const getRxCartAvailablePaymentMethod = useReactiveVar(
    rxCartAvailablePaymentMethod,
  );
  const isShowingAvailablePayment =
    getRxCartAvailablePaymentMethod?.length > 0 ?? 0;
  const isFree = _.countBy(
    getRxCartAvailablePaymentMethod,
    item => item.code === IS_FREE,
  ).true;

  useEffect(() => {
    if (isFree) {
      const onSetPaymentFree = async () => {
        try {
          const cart_id = getRxCartId;
          const res = await selectPaymentMethodHook({
            paramsOpt: {isReturn: true},
            params: {
              input: {cart_id, payment_method: {code: IS_FREE}},
            },
          });
          if (res?.data) {
            const selectedPayment = _.get(
              res,
              'data.setPaymentMethodOnCart.cart.selected_payment_method',
            );

            console.log('res', res, selectedPayment);
            rxCartSelectedPaymentMethod(selectedPayment);
          }
        } catch (err) {
          console.log('[err] set payment method free', err);
        }
      };
      onSetPaymentFree();
    } else {
      // reset payment
      setSelectedPaymentMethod(null);
    }
  }, [isFree]);

  /**
   * ---------------------------------------------------- *
   * @function onSelectedPaymentMethod
   * @summary for process selected payment method
   * ---------------------------------------------------- *
   */
  const onSelectedPaymentMethod = async ({index, item}) => {
    ctxCheckout?.setIsCart({
      ...ctxCheckout?.isCart,
      loadingButtonOrder: true,
    });

    try {
      const cart_id = getRxCartId;
      const payment_method = {code: item?.code};
      const res = await selectPaymentMethodHook({
        paramsOpt: {isReturn: true},
        params: {
          input: {cart_id, payment_method},
        },
      });

      if (res?.data) {
        const selectedPayment = _.get(
          res,
          'data.setPaymentMethodOnCart.cart.selected_payment_method',
        );
        rxCartSelectedPaymentMethod(selectedPayment);
        crashlytics().setAttribute(PAYMENT_METHOD, item?.code?.toString());
        setSelectedPaymentMethod(index);
        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          selectedPaymentMethod: true,
          loadingButtonOrder: false,
        });
      } else {
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
      console.log('[err] selected payment method', err);
    }
  };

  useEffect(() => {
    let selectedPaymentIndex = null;
    if (getRxCartSelectedPayment?.code) {
      getRxCartAvailablePaymentMethod?.map((item, index) => {
        if (item?.code === getRxCartSelectedPayment?.code) {
          selectedPaymentIndex = index;
        }
      });
    }
    setSelectedPaymentMethod(selectedPaymentIndex);
    ctxCheckout?.setIsCart({
      ...ctxCheckout?.isCart,
      selectedPaymentMethod: selectedPaymentIndex !== null ? true : false,
    });
  }, [getRxCartSelectedPayment, isShowingAvailablePayment]);

  return (
    <Section>
      <Section row>
        <Section width={'100%'} paddingHorizontal={10} marginBottom={10}>
          <Label bold>{t('cart_checkout.paymentInformation')}</Label>
        </Section>
      </Section>
      <Show
        when={
          !isShowingAvailablePayment ||
          !ctxCheckout?.isCart?.selectedShippingMethod
        }>
        <Section paddingHorizontal={10} marginBottom={10}>
          <Label small color={Colors.GRAY_DARK}>
            {t('cart_checkout.choosePaymentMethod')}
          </Label>
        </Section>
      </Show>
      <Show
        when={
          isShowingAvailablePayment &&
          ctxCheckout?.isCart?.selectedShippingMethod &&
          isFree
        }>
        <Section
          border={1}
          borderColor={Colors.GRAY_SMOOTH3}
          borderRadius={10}
          marginHorizontal={10}
          paddingHorizontal={10}
          paddingVertical={10}>
          <Label small>{getRxCartSelectedPayment?.title}</Label>
        </Section>
      </Show>
      <Show
        when={
          isShowingAvailablePayment &&
          ctxCheckout?.isCart?.selectedShippingMethod &&
          !isFree
        }>
        <Section
          border={1}
          borderColor={Colors.GRAY_SMOOTH3}
          borderRadius={10}
          paddingVertical={10}
          style={{
            opacity: isLoadingSelectPaymentMethod ? 0.4 : 1,
          }}>
          {isShowingAvailablePayment &&
            getRxCartAvailablePaymentMethod?.map((item, index) => {
              const isLast =
                getRxCartAvailablePaymentMethod?.length === index + 1;
              const isSelected = index === selectedPaymentMethod;
              const getPaymentCode = item?.code;
              const getPaymentTitle = item?.title;
              const onPressPaymentMethodItem = isLoadingSelectPaymentMethod
                ? false
                : () => onSelectedPaymentMethod({index, item});

              return (
                <Section key={`payment-method-${index}-${getPaymentCode}`}>
                  <TouchableRipple
                    style={styles.paymentItem}
                    onPress={onPressPaymentMethodItem}>
                    <Section row paddingVertical={5}>
                      <Section width={'7%'} verticalCenter>
                        <RadioButton
                          selected={isSelected}
                          color={Colors.PRIMARY}
                          activeColor={
                            getRxUserTheme === 'dark'
                              ? Colors.WHITE
                              : Colors.BLACK
                          }
                          onPress={onPressPaymentMethodItem}
                        />
                      </Section>
                      <Section width={'93%'} verticalCenter>
                        <Label small bold>
                          {getPaymentTitle}
                        </Label>
                      </Section>
                    </Section>
                  </TouchableRipple>
                  <Show when={!isLast}>
                    <Section paddingHorizontal={10}>
                      <Divider />
                    </Section>
                  </Show>
                </Section>
              );
            })}
        </Section>
      </Show>
    </Section>
  );
};

export default BlockPaymentMethod;
