import React from 'react';
import {Colors} from '@app/styles';
import {useTranslation} from 'react-i18next';
import {rxUserTheme} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import Show from '@app/components/Show';
import Section from '@app/components/Section';
import Label from '@app/components/Label';

const AtomShippingAddressAccountItem = ({
  address,
  onUpdateAddress,
  onShowModalAddress,
}) => {
  const {t} = useTranslation();
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  return (
    <Section
      paddingVertical={20}
      paddingHorizontal={30}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: Colors.GRAY_LIGHT,
      }}>
      <Show when={address.default_shipping}>
        <Label bold style={{marginBottom: 10}}>
          {t('account_myaccount.view.defaultShipping')}
        </Label>
      </Show>
      <Label>
        {address.firstname} {address.lastname}
      </Label>
      <Label>{address.street}</Label>
      <Label>
        {address.city} {address.region} {address.postcode}
      </Label>
      <Label>
        {t('account_myaccount.label.phone')}
        {': '}
        {address.telephone}
      </Label>
      <Section row marginTop={10}>
        <Label
          underline
          color={getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY}
          marginRight={15}
          onPress={onUpdateAddress}>
          {t('account_myaccount.btn.edit')}
        </Label>
        {!address.default_shipping && (
          <Label
            underline
            color={getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY}
            onPress={onShowModalAddress}>
            {t('account_myaccount.btn.delete')}
          </Label>
        )}
      </Section>
    </Section>
  );
};

export default AtomShippingAddressAccountItem;
