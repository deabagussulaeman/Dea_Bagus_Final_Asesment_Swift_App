import React, {useState, useMemo, useEffect, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableRipple} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {Colors} from '@app/styles';
import {useReactiveVar} from '@apollo/client';
import {
  rxUserAddresses,
  rxUserDefaultShippingAddressId,
  rxUserInformation,
  rxUserType,
} from '@app/services/cache';
import {
  TYPE_MODAL_SHIPPING_ADDRESS_FORM,
  TYPE_MODAL_SHIPPING_ADDRESS_LIST,
  USER_CUSTOMER,
  BYPASS_ERROR_CHECKOUT_BLOCK_SHIPPING_USER_ADDRESS,
} from '@app/helpers/Constants';
import {CheckoutContext} from '@app/_modules/cart_checkout/_controller';

import Show from '@app/components/Show';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import Divider from '@app/components/Divider';
import AppModal from '@app/components/_AppModal';
import useCarts, {TYPES} from '@app/hooks/carts/useCarts';
import AtomShimmerCheckoutShippingAddress from '@app/components/_ShimmerSkeleton/atoms/ShimmerCheckoutShippingAddress';
import useDataCustomer, {
  TYPES as CUSTOMER_TYPES,
} from '@app/hooks/customer/useDataCustomer';
import {guestCheckout} from '@root/swift.config';

const styles = StyleSheet.create({
  btnOutline: {
    paddingVertical: 5,
    borderColor: Colors.GRAY_DARK,
    borderWidth: 1,
    borderRadius: 50,
  },
});

const BlockShippingAddress = () => {
  const {t} = useTranslation();
  const [showShippingAddressForm, setShowShippingAddressForm] = useState(false);
  const [showShippingAddressList, setShowShippingAddressList] = useState(false);
  const getRxUserType = useReactiveVar(rxUserType);
  const getRxUserInformation = useReactiveVar(rxUserInformation);
  const getRxUserAddresses = useReactiveVar(rxUserAddresses);
  const getRxUserDefaultShippingAddressId = useReactiveVar(
    rxUserDefaultShippingAddressId,
  );
  const ctxCheckout = useContext(CheckoutContext);
  const {data: getDataCartInfo, loading: loadingDataCart} = useCarts({
    initialized: true,
    type: TYPES.INFO,
  });
  const {
    data: getDataAddress,
    loading: loadingDataAddress,
    setCart: onRefetchDataAddress,
  } = useCarts({
    initialized: true,
    type: TYPES.ADDRESS,
  });
  const isFillShippingAddress = getDataAddress?.shipping_addresses?.length > 0;
  const isCustomerHasAddress =
    getRxUserAddresses && getRxUserAddresses.length > 0;
  const {setDataResponse: getUserAddressWithSetCartAddress} = useDataCustomer({
    initialized: false,
    type: CUSTOMER_TYPES.USER_ADDRESS_WITH_SET_CART_ADDRESS,
    configErr: {
      logSource: BYPASS_ERROR_CHECKOUT_BLOCK_SHIPPING_USER_ADDRESS,
      isBypass:
        guestCheckout.enable && getRxUserType !== USER_CUSTOMER ? true : false,
    },
  });

  /**
   * ---------------------------------------------------- *
   * @dependency [getDataAddress]
   * @summary set cart value
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    if (getDataAddress?.shipping_addresses) {
      if (getDataAddress?.shipping_addresses?.length > 0) {
        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          selectedShippingAddress: true,
        });
      }
      // get & set cart address
      else {
        getUserAddressWithSetCartAddress();
      }
    }
  }, [getDataAddress]);

  /**
   * ---------------------------------------------------- *
   * @dependency [getRxUserDefaultShippingAddressId]
   * @summary refetch address cart data
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    if (getRxUserDefaultShippingAddressId) {
      onRefetchDataAddress();
    }
  }, [getRxUserDefaultShippingAddressId]);

  /**
   * ---------------------------------------------------- *
   * @const {getDataCart}
   * @summary useMemo for merge data cart
   * ---------------------------------------------------- *
   */
  const getDataCart = useMemo(() => {
    return {
      ...getDataAddress?.shipping_addresses[0],
      ...getDataCartInfo,
    };
  }, [getDataCartInfo, getDataAddress]);

  /**
   * ---------------------------------------------------- *
   * @function onShowShippingAddressModalForm
   * @summary for open shipping address modal add | edit
   * ---------------------------------------------------- *
   */
  const onShowShippingAddressModalForm = () => {
    if (
      (!isFillShippingAddress ||
        (guestCheckout.enable && getRxUserType !== USER_CUSTOMER)) &&
      !isCustomerHasAddress
    ) {
      setShowShippingAddressForm(true);
    } else {
      ctxCheckout?.setIsCart({...ctxCheckout?.isCart, getEditAddress: true});
      setShowShippingAddressList(true);
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function onCloseShippingAddressModalForm
   * @summary for close shipping address modal
   * ---------------------------------------------------- *
   */
  const onCloseShippingAddressModalForm = () =>
    setShowShippingAddressForm(false);

  /**
   * ---------------------------------------------------- *
   * @function setShowShippingAddressList
   * @summary for close shipping address list modal
   * ---------------------------------------------------- *
   */
  const onCloseShippingAddressModalList = () =>
    setShowShippingAddressList(false);

  /**
   * ---------------------------------------------------- *
   * @function onCallbackComponentAddressList
   * @summary for callback component address list
   * ---------------------------------------------------- *
   */
  const onCallbackComponentAddressList = () => {};

  const isShowDataInfo = !loadingDataCart && !loadingDataAddress;
  const isShowDataInfoEmpty =
    getDataAddress?.shipping_addresses && !isFillShippingAddress;
  return (
    <Section>
      <Section row>
        <Section width={'60%'} paddingHorizontal={10}>
          <Label bold>{t('cart_checkout.shippingInformation')}</Label>
        </Section>
        {/* ADDRESS BUTTON */}
        <Section width={'40%'}>
          <Show when={isShowDataInfo}>
            <TouchableRipple
              style={styles.btnOutline}
              onPress={onShowShippingAddressModalForm}>
              <Section horizontalCenter>
                <Label bold xsmall>
                  {isFillShippingAddress
                    ? t('cart_checkout.editAddress')
                    : isCustomerHasAddress
                    ? t('cart_checkout.chooseAddress')
                    : t('cart_checkout.addAddress')}
                </Label>
              </Section>
            </TouchableRipple>
          </Show>
        </Section>
        {/* ADDRESS BUTTON */}
      </Section>
      <Section paddingHorizontal={10} marginTop={10} marginBottom={20}>
        {/* ADDRESS INFO SHIMMER */}
        <Show when={!isShowDataInfo}>
          <AtomShimmerCheckoutShippingAddress />
        </Show>
        {/* ADDRESS INFO */}
        <Show when={isShowDataInfo && isFillShippingAddress}>
          <Label small>
            {getDataCart?.email ?? getRxUserInformation?.email}
          </Label>
          <Label small>
            {getDataCart?.firstname} {getDataCart?.lastname}
          </Label>
          <Label small>
            {Object.keys(getDataCart)?.length > 0 &&
            getDataCart?.hasOwnProperty('street')
              ? getDataCart?.street[0]
              : '-'}
          </Label>
          <Label small>
            {getDataCart?.region?.label} {getDataCart?.city}
          </Label>
        </Show>
        {/* ADDRESS INFO */}
        {/* ADDRESS SUB INFO */}
        <Show when={isShowDataInfoEmpty && !isCustomerHasAddress}>
          <Label small color={Colors.GRAY_DARK}>
            {t('cart_checkout.shippingInformationPleaseAdd')}
          </Label>
        </Show>
        <Show when={isShowDataInfoEmpty && isCustomerHasAddress}>
          <Label small color={Colors.GRAY_DARK}>
            {t('cart_checkout.shippingInformationPleaseChoose')}
          </Label>
        </Show>
        {/* ADDRESS SUB INFO */}
      </Section>
      <Section paddingHorizontal={10} marginBottom={10}>
        <Divider />
      </Section>
      <AppModal
        isEdit={isFillShippingAddress ? getDataCart : null}
        type={TYPE_MODAL_SHIPPING_ADDRESS_FORM}
        show={showShippingAddressForm}
        onClose={onCloseShippingAddressModalForm}
        onRefetchDataAddress={onRefetchDataAddress}
      />
      <AppModal
        type={TYPE_MODAL_SHIPPING_ADDRESS_LIST}
        show={showShippingAddressList}
        onClose={onCloseShippingAddressModalList}
        onCallbackComponent={onCallbackComponentAddressList}
      />
    </Section>
  );
};

export default BlockShippingAddress;
