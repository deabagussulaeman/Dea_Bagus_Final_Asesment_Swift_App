import React, {useEffect, useState} from 'react';
import {useReactiveVar} from '@apollo/client';
import {useIsFocused} from '@react-navigation/native';
import {DELETE_ADDRESS} from '@app/_modules/account/services/schema';
import {useTranslation} from 'react-i18next';
import {ScrollView, RefreshControl} from 'react-native';
import {Button, Modal, ActivityIndicator} from 'react-native-paper';
import {Mixins, Colors} from '@app/styles';
import {rxUserAddresses, rxAppSnackbar, rxUserTheme} from '@app/services/cache';
import AtomShippingAddressAccountItem from '@app/components/ListShippingAddress/atoms/ShippingAddressAccount/_item';
import useCustomMutation from '@app/hooks/useCustomMutation';
import Section from '@app/components/Section';
import AtomModalShippingAddressForm from '@app/components/_AppModal/atoms/ModalShippingAddressForm';
import Label from '@app/components/Label';
import Show from '@app/components/Show';
import useDataCustomer, {
  TYPES as CUSTOMER_TYPES,
} from '@app/hooks/customer/useDataCustomer';

const ListShippingAddressAccount = () => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const {onRefetchData: deleteAddressHook} = useCustomMutation({
    schema: DELETE_ADDRESS,
  });
  const {setDataResponse: getUserAddress} = useDataCustomer({
    initialized: true,
    type: CUSTOMER_TYPES.USER_ADDRESS,
  });

  const isFocused = useIsFocused();
  const addressClientData = useReactiveVar(rxUserAddresses);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addresses, setAddressData] = useState([]);
  const [editAddressData, setEditAddressData] = useState({});
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [deleteIdAddress, setDeleteIdAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const {t} = useTranslation();

  useEffect(() => {
    if (isFocused) {
      if (addressClientData) {
        setAddressData(addressClientData);
      }
    }
  }, [isFocused]);

  useEffect(() => {
    if (addressClientData) {
      setAddressData(addressClientData);
    }
  }, [addressClientData]);

  const onDeleteAddress = async addressId => {
    setLoading(true);

    try {
      const res = await deleteAddressHook({
        params: {
          id: addressId,
        },
        paramsOpt: {isReturn: true},
      });

      if (res?.data) {
        await getUserAddress();
        rxAppSnackbar({
          message: t('account_myaccount.message.successDeleteAddress'),
        });
      } else {
        rxAppSnackbar({
          message: t('account_myaccount.message.errorDeleteAddress'),
        });
      }

      setShowModalDelete(false);
      setLoading(false);
    } catch (error) {
      setShowModalDelete(false);
      setLoading(false);
      rxAppSnackbar({
        message: t('account_myaccount.message.errorDeleteAddress'),
      });
    }
  };

  const onCloseModal = () => {
    setEditAddressData({});
    setShowAddAddressModal(false);
  };

  const onUpdateAddress = address => {
    setEditAddressData(address);
    setShowAddAddressModal(true);
  };

  const onShowModalAddress = addressId => {
    setDeleteIdAddress(addressId);
    setShowModalDelete(true);
  };

  const onHideModalAddress = () => {
    setDeleteIdAddress(null);
    setShowModalDelete(false);
  };

  const loadingMessage = () => {
    return rxAppSnackbar({
      message: t('account_myaccount.message.loadingMessage'),
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getUserAddress();
    setRefreshing(false);
  };

  const ItemAddress = ({data}) => {
    return (
      <Section marginBottom={10}>
        {data &&
          data.map((address, index) => {
            return (
              <AtomShippingAddressAccountItem
                key={index}
                address={address}
                onUpdateAddress={() => onUpdateAddress(address)}
                onShowModalAddress={() => onShowModalAddress(address.addressId)}
              />
            );
          })}
      </Section>
    );
  };

  const isEmptyData = addresses?.length < 1;
  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: (Mixins.MAX_WIDTH * 0.25) / 2,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {!isEmptyData && <ItemAddress data={addresses} />}
        {isEmptyData && (
          <Section style={{marginTop: 20}}>
            <Label center>{t('account_myaccount.view.addressNotFound')}</Label>
          </Section>
        )}
        <Section marginLeft={20} paddingBottom={20}>
          <Button
            mode={'outlined'}
            onPress={() => setShowAddAddressModal(true)}
            labelStyle={{
              fontWeight: 'bold',
              fontSize: 15,
              color: getRxUserTheme === 'dark' ? Colors.BLACK : Colors.WHITE,
            }}
            contentStyle={{paddingVertical: 5}}
            style={{
              marginTop: 15,
              borderRadius: 50,
              backgroundColor:
                getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY,
            }}>
            {t('account_myaccount.btn.addAddress')}
          </Button>
        </Section>
      </ScrollView>
      <AtomModalShippingAddressForm
        isEdit={editAddressData}
        show={showAddAddressModal}
        onClose={onCloseModal}
      />
      <Modal visible={showModalDelete}>
        <Section horizontalCenter verticalCenter>
          <Section
            spaceEvenly
            height={200}
            width={200}
            borderRadius={10}
            backgroundColor={Colors.WHITE}>
            <Section horizontalCenter>
              <Show when={loading}>
                <ActivityIndicator />
                <Label>{t('account_myaccount.label.processDeleting')}</Label>
              </Show>
              <Show when={!loading}>
                <Label>{t('account_myaccount.label.makesureDelete')}</Label>
              </Show>
            </Section>

            <Section row spaceEvenly>
              <Section
                onPress={
                  loading
                    ? loadingMessage
                    : () => onDeleteAddress(deleteIdAddress)
                }>
                <Label underline>{t('account_myaccount.btn.delete')}</Label>
              </Section>
              <Section onPress={loading ? loadingMessage : onHideModalAddress}>
                <Label underline>{t('account_myaccount.btn.cancel')}</Label>
              </Section>
            </Section>
          </Section>
        </Section>
      </Modal>
    </>
  );
};

export default ListShippingAddressAccount;
