import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '@app/styles';
import {useTranslation} from 'react-i18next';
import {rxUserTheme} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import Show from '@app/components/Show';

const AtomShippingAddressAccountItem = ({
  isSelected = false,
  address,
  onSelectedAddressItem,
  onUpdateAddress,
}) => {
  const {t} = useTranslation();
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const borderColor =
    getRxUserTheme === 'dark' ? Colors.GRAY_DARK : Colors.GRAY_MEDIUM;
  const selectedBorderColor =
    getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY;

  return (
    <Section marginHorizontal={20} marginVertical={10}>
      <Section
        padding={20}
        border={isSelected ? 2 : 1}
        borderRadius={10}
        borderColor={isSelected ? selectedBorderColor : borderColor}
        onPress={onSelectedAddressItem}>
        <Show when={address.default_shipping}>
          <Section
            paddingVertical={5}
            paddingHorizontal={15}
            marginBottom={10}
            border={1}
            borderRadius={5}
            borderColor={
              getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY
            }
            style={{alignSelf: 'flex-start'}}>
            <Label
              color={getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY}>
              {t('account_myaccount.view.defaultShipping')}
            </Label>
          </Section>
        </Show>
        <Label bold style={{marginBottom: 3}}>
          {address.firstname} {address.lastname}
        </Label>
        <Label style={{marginBottom: 3}}>{address.street}</Label>
        <Label style={{marginBottom: 3}}>
          {address.city} {address.region} {address.postcode}
        </Label>
        <Show when={isSelected}>
          <Section style={{position: 'absolute', right: 0}} borderRadius={30}>
            <Icon
              name={'pencil-outline'}
              color={getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY}
              size={18}
              onPress={onUpdateAddress}
            />
          </Section>
        </Show>
      </Section>
    </Section>
  );
};

export default AtomShippingAddressAccountItem;
