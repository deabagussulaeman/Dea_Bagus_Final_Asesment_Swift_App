import React, {useEffect, useState} from 'react';
import useCarts, {TYPES} from '@app/hooks/carts/useCarts';
import {StyleSheet} from 'react-native';
import {useReactiveVar} from '@apollo/client';
import {useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native';
import {TouchableRipple, Button} from 'react-native-paper';
import {Colors, Typography} from '@app/styles';
import {TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';
import {rxUserAddresses, rxAppSnackbar, rxUserTheme} from '@app/services/cache';
import {useSelectShippingAddress} from '@app/hooks/carts/useSelectShippingAddress';
import Icon from 'react-native-vector-icons/Feather';
import AtomShippingAddressCheckoutItem from '@app/components/ListShippingAddress/atoms/ShippingAddressCheckout/_item';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import Show from '@app/components/Show';
import AtomModalShippingAddressForm from '@app/components/_AppModal/atoms/ModalShippingAddressForm';
import _ from 'lodash';
import NavBar from '@app/components/NavBar';
import AppSnackBar from '@app/components/SnackBar';

const styles = StyleSheet.create({
  flex: {flex: 1},
  btnAddAddress: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 5,
    paddingVertical: 35,
  },
  btnCancel: {
    borderWidth: 2,
    paddingVertical: 10,
    borderRadius: 30,
  },
  btnApply: {
    paddingVertical: 4,
    borderRadius: 30,
  },
  btnApplyDisabled: {
    backgroundColor: Colors.GRAY_MEDIUM,
    paddingVertical: 4,
    borderRadius: 30,
  },
  btnApplyLabel: {
    ...Typography.FONT_BOLD,
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
});

const ListShippingAddressCheckout = ({onClose}) => {
  const isFocused = useIsFocused();
  const addressClientData = useReactiveVar(rxUserAddresses);
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addresses, setAddressData] = useState([]);
  const [editAddressData, setEditAddressData] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoadingSelectedAddress, setIsLoadingSelectedAddress] =
    useState(false);
  const {t} = useTranslation();
  const isEmptyData = addresses?.length < 1;
  const {setDefautShippingToCart, setDefautBillingToCart} =
    useSelectShippingAddress();

  const {setCart: setDataCartInfo} = useCarts({
    initialized: false,
    type: TYPES.INFO,
  });
  const {setCart: setDataCartAddress, data: getCartAddress} = useCarts({
    initialized: true,
    type: TYPES.ADDRESS,
  });
  /**
   * ---------------------------------------------------- *
   * @dependency [isFocused]
   * @summary for set new address data
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    if (isFocused) {
      if (addressClientData) {
        let getSelectedAddressIndex = _.findIndex(addressClientData, {
          default_shipping: true,
        });
        if (getCartAddress?.shipping_addresses[0]?.hasOwnProperty('street')) {
          getSelectedAddressIndex = _.findIndex(addressClientData, {
            city: getCartAddress?.shipping_addresses[0]?.city,
            telephone: getCartAddress?.shipping_addresses[0]?.telephone,
            street: getCartAddress?.shipping_addresses[0]?.street[0],
          });
        }
        if (
          getSelectedAddressIndex !== -1 &&
          addressClientData[getSelectedAddressIndex].hasOwnProperty('addressId')
        ) {
          const getSelectedAddressId =
            addressClientData[getSelectedAddressIndex]?.addressId;
          setSelectedAddress({
            index: getSelectedAddressIndex,
            addressId: getSelectedAddressId,
          });
        }
        setAddressData(addressClientData);
      }
    }
  }, [isFocused, addressClientData]);

  /**
   * ---------------------------------------------------- *
   * @const {onSelectedAddressItem}
   * @summary on selected address item
   * ---------------------------------------------------- *
   */
  const onSelectedAddressItem = ({index, item}) => {
    const addressId = item?.addressId;
    setSelectedAddress({index, addressId});
  };

  /**
   * ---------------------------------------------------- *
   * @const {onUpdateAddress}
   * @summary for update address
   * ---------------------------------------------------- *
   */
  const onUpdateAddress = address => {
    setEditAddressData(address);
    setShowAddAddressModal(true);
  };

  /**
   * ---------------------------------------------------- *
   * @const {onCloseModal}
   * @summary for close modal
   * ---------------------------------------------------- *
   */
  const onCloseModal = () => {
    setEditAddressData({});
    setShowAddAddressModal(false);
  };

  /**
   * ---------------------------------------------------- *
   * @const onShowAddressModal
   * @summary for show modal
   * ---------------------------------------------------- *
   */
  const onShowAddressModal = () => setShowAddAddressModal(true);

  /**
   * ---------------------------------------------------- *
   * @const onApplyCartShippingAddress
   * @summary for for apply selected shipping address
   * ---------------------------------------------------- *
   */
  const onApplyCartShippingAddress = async () => {
    try {
      setIsLoadingSelectedAddress(true);
      const res = await setDefautShippingToCart(selectedAddress.addressId);
      if (res?.data) {
        await setDefautBillingToCart(selectedAddress.addressId);
        await setDataCartInfo();
        await setDataCartAddress();
      }
      setIsLoadingSelectedAddress(false);
      onClose();
    } catch (err) {
      console.log('[err] apply cart shipping', err);
      setIsLoadingSelectedAddress(false);
    }
  };

  /**
   * ---------------------------------------------------- *
   * @const ItemAddress
   * @summary child component of shipping address list item
   * ---------------------------------------------------- *
   */
  const ItemAddress = ({data}) => {
    return (
      <Section marginBottom={10}>
        {data &&
          data.map((address, index) => {
            const isSelected = selectedAddress?.index === index;
            return (
              <AtomShippingAddressCheckoutItem
                key={index}
                address={address}
                isSelected={isSelected}
                onUpdateAddress={
                  isLoadingSelectedAddress
                    ? loadingMessage
                    : () => onUpdateAddress(address)
                }
                onSelectedAddressItem={() =>
                  onSelectedAddressItem({index, item: address})
                }
              />
            );
          })}
      </Section>
    );
  };

  const loadingMessage = () => {
    return rxAppSnackbar({
      message: t('cart_checkout.error.loadingMessage'),
    });
  };

  return (
    <>
      <NavBar
        type={TYPE_NAVBAR_CUSTOM}
        center
        useClose
        useWhite
        useShadow={false}
        useBackPress={isLoadingSelectedAddress ? loadingMessage : onClose}
        title={t('cart_checkout.changeShippingInformation')}
        titleStyle={{...Typography.FONT_BOLD, fontWeight: 'bold'}}
      />
      <ScrollView
        style={[
          styles.flex,
          {
            backgroundColor:
              getRxUserTheme === 'dark' ? Colors.DARK : Colors.WHITE,
          },
        ]}>
        <Show when={!isEmptyData}>
          <ItemAddress data={addresses} />
        </Show>
        <Show when={isEmptyData}>
          <Section style={{marginTop: 20}}>
            <Label center>{t('account_myaccount.view.addressNotFound')}</Label>
          </Section>
        </Show>
        <Section marginHorizontal={20} paddingBottom={20}>
          <TouchableRipple
            onPress={
              isLoadingSelectedAddress ? loadingMessage : onShowAddressModal
            }
            style={[
              styles.btnAddAddress,
              {
                borderColor:
                  getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY,
              },
            ]}>
            <Section horizontalCenter verticalCenter row>
              <Section
                border={2}
                borderColor={
                  getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY
                }
                padding={3}
                borderRadius={3}
                marginRight={8}>
                <Icon
                  name="plus"
                  size={14}
                  color={
                    getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY
                  }
                />
              </Section>
              <Label bold>{t('account_myaccount.btn.addAddress')}</Label>
            </Section>
          </TouchableRipple>
        </Section>
      </ScrollView>
      <Section
        row
        paddingHorizontal={20}
        paddingVertical={10}
        backgroundColor={
          getRxUserTheme === 'dark' ? Colors.DARK : Colors.WHITE
        }>
        <Section width={'50%'} paddingHorizontal={10}>
          <TouchableRipple
            onPress={isLoadingSelectedAddress ? loadingMessage : onClose}
            style={[
              styles.btnCancel,
              {
                borderColor:
                  getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY,
              },
            ]}>
            <Section>
              <Label center bold>
                {t('label.cancel')}
              </Label>
            </Section>
          </TouchableRipple>
        </Section>
        <Section width={'50%'} paddingHorizontal={10}>
          <Button
            onPress={onApplyCartShippingAddress}
            loading={isLoadingSelectedAddress}
            disabled={isLoadingSelectedAddress}
            labelStyle={[
              styles.btnApplyLabel,
              {
                color: getRxUserTheme === 'dark' ? Colors.BLACK : Colors.WHITE,
              },
            ]}
            style={[
              isLoadingSelectedAddress
                ? styles.btnApplyDisabled
                : styles.btnApply,
              {
                borderColor:
                  getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY,
                backgroundColor:
                  getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY,
              },
            ]}>
            {t('apply')}
          </Button>
        </Section>
      </Section>
      <AtomModalShippingAddressForm
        isEdit={editAddressData}
        show={showAddAddressModal}
        onClose={onCloseModal}
      />
      <AppSnackBar />
    </>
  );
};

export default ListShippingAddressCheckout;
