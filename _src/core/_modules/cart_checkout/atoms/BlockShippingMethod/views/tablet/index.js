import React, {useContext, useEffect, useState} from 'react';
import {rxCartDataAddress, rxCartId, rxUserTheme} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {numberFormat} from '@app/helpers/General';
import {Colors} from '@app/styles';
import {TouchableRipple} from 'react-native-paper';
import {SET_SHIPPING_METHOD} from '@app/_modules/cart/services/schema';
import {SHIPPING_METHOD_CODE} from '@app/helpers/Constants';
import {CheckoutContext} from '@app/_modules/cart_checkout/_controller';
import crashlytics from '@react-native-firebase/crashlytics';
import useCarts, {TYPES} from '@app/hooks/carts/useCarts';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import RadioButton from '@app/components/RadioButton';
import useCustomMutation from '@app/hooks/useCustomMutation';
import Divider from '@app/components/Divider';
import Show from '@app/components/Show';
import AtomShimmerCheckoutShippingMethod from '@app/components/_ShimmerSkeleton/atoms/ShimmerCheckoutShippingMethod';

const styles = StyleSheet.create({
  shippingItem: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
});

const BlockShippingMethod = () => {
  const {t} = useTranslation();
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const ctxCheckout = useContext(CheckoutContext);
  const getRxCartId = useReactiveVar(rxCartId);
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const getRxCartDataAddress = useReactiveVar(rxCartDataAddress);
  const getAvailableShippingMethod =
    getRxCartDataAddress?.shipping_addresses[0]?.available_shipping_methods;
  const isShowShippingMethod = getAvailableShippingMethod?.length > 0 ?? 0;
  const {
    setCart: setDataAvailablePaymentMethod,
    loading: isLoadingGetDataAvailablePaymentMethod,
  } = useCarts({
    initialized: true,
    type: TYPES.AVAILABLE_PAYMENT,
  });
  const {setCart: setPrices} = useCarts({
    initialized: false,
    type: TYPES.PRICE,
  });
  const {
    onRefetchData: onPostSelectShippingMethodHook,
    loading: isLoadingSelectedShippingMethod,
  } = useCustomMutation({
    schema: SET_SHIPPING_METHOD,
  });

  /**
   * ---------------------------------------------------- *
   * @function useEffect
   * @summary for set Selected Shipping Method
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    if (getRxCartDataAddress?.shipping_addresses[0] && isShowShippingMethod) {
      if (
        getRxCartDataAddress?.shipping_addresses[0]?.selected_shipping_method
      ) {
        const selectedShippingMethodCart =
          getRxCartDataAddress?.shipping_addresses[0]?.selected_shipping_method;
        const getIndex = getAvailableShippingMethod.findIndex(
          item =>
            item.carrier_code === selectedShippingMethodCart.carrier_code &&
            item.method_code === selectedShippingMethodCart.method_code,
        );
        setPrices();
        setDataAvailablePaymentMethod();
        setSelectedShippingMethod(getIndex);
        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          selectedShippingAddress: true,
          selectedShippingMethod: true,
        });
      } else {
        setPrices();
        setDataAvailablePaymentMethod();
        setSelectedShippingMethod(null);
        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          selectedShippingAddress: true,
          selectedShippingMethod: false,
        });
      }
    }
  }, [getRxCartDataAddress, isShowShippingMethod]);

  /**
   * ---------------------------------------------------- *
   * @function onSelectShippingMethod
   * @summary for process selected shipping method
   * ---------------------------------------------------- *
   */
  const onSelectShippingMethod = async ({index, item}) => {
    ctxCheckout?.setIsCart({
      ...ctxCheckout?.isCart,
      loadingButtonOrder: true,
    });

    try {
      const carrier_code = item?.carrier_code;
      const method_code = item?.method_code;
      const cart_id = getRxCartId;
      const shipping_methods = [{carrier_code, method_code}];
      const res = await onPostSelectShippingMethodHook({
        paramsOpt: {isReturn: true},
        params: {
          input: {cart_id, shipping_methods},
        },
      });
      if (res?.data) {
        setPrices();
        setDataAvailablePaymentMethod();
        setSelectedShippingMethod(index);
        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          selectedShippingMethod: true,
          loadingButtonOrder: false,
        });
        crashlytics().setAttribute(
          SHIPPING_METHOD_CODE,
          carrier_code.toString(),
        );
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
      console.log('[err] selected shipping method', err);
    }
  };
  return (
    <Section>
      <Section row>
        <Section width={'100%'} paddingHorizontal={10} marginBottom={10}>
          <Label bold>{t('cart_checkout.shippingMethod')}</Label>
        </Section>
      </Section>
      <Show
        when={
          ctxCheckout?.isCart?.selectedShippingAddress &&
          getAvailableShippingMethod?.length < 1
        }>
        <Section paddingHorizontal={10} marginBottom={10}>
          <Label small color={Colors.GRAY_DARK}>
            {t('noData')}
          </Label>
        </Section>
      </Show>
      <Show
        when={!isLoadingGetDataAvailablePaymentMethod && !isShowShippingMethod}>
        <Section paddingHorizontal={10} marginBottom={10}>
          <Label small color={Colors.GRAY_DARK}>
            {t('cart_checkout.chooseShippingMethod')}
          </Label>
        </Section>
      </Show>
      <Show
        when={
          isLoadingGetDataAvailablePaymentMethod &&
          !ctxCheckout?.isCart?.selectedShippingAddress
        }>
        <AtomShimmerCheckoutShippingMethod />
      </Show>
      <Show when={ctxCheckout?.isCart?.selectedShippingAddress}>
        <Section>
          {isShowShippingMethod &&
            getAvailableShippingMethod?.map((item, index) => {
              const isSelected = index === selectedShippingMethod;
              const isAvailable = item?.available;
              const getMethodTitle = item?.method_title;
              const getCarrierCode = item?.carrier_code;
              const getCarrierTitle = item?.carrier_title;
              const getPrice = numberFormat({
                prefix: item?.price_incl_tax?.currency,
                value: item?.price_incl_tax?.value,
              });
              if (!isAvailable) {
                return null;
              }
              return (
                <TouchableRipple
                  key={`shipping-method-${index}-${getCarrierCode}`}
                  style={[
                    styles.shippingItem,
                    {opacity: isLoadingSelectedShippingMethod ? 0.4 : 1},
                  ]}
                  onPress={
                    isLoadingSelectedShippingMethod
                      ? false
                      : () => onSelectShippingMethod({index, item})
                  }>
                  <Section row paddingVertical={4}>
                    <Section width={'7%'} verticalCenter>
                      <RadioButton
                        selected={isSelected}
                        color={Colors.PRIMARY}
                        activeColor={
                          getRxUserTheme === 'dark'
                            ? Colors.WHITE
                            : Colors.PRIMARY
                        }
                        onPress={
                          isLoadingSelectedShippingMethod
                            ? false
                            : () => onSelectShippingMethod({index, item})
                        }
                      />
                    </Section>
                    <Section width={'93%'} verticalCenter>
                      <Label small>
                        {`${getMethodTitle} - ${getCarrierTitle}`}{' '}
                        <Label small bold>
                          {getPrice}
                        </Label>
                      </Label>
                    </Section>
                  </Section>
                </TouchableRipple>
              );
            })}
        </Section>
      </Show>
      <Section paddingHorizontal={10} marginTop={10} marginBottom={10}>
        <Divider />
      </Section>
    </Section>
  );
};

export default BlockShippingMethod;
