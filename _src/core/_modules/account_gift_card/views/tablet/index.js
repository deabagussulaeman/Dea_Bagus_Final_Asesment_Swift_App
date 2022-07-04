import Button from '@app/components/Button';
import Input from '@app/components/Input';
import NavBar from '@app/components/NavBar';
import Show from '@app/components/Show';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import {numberFormat} from '@app/helpers/General';
import {TYPE_APPBAR, TYPE_INPUT_CUSTOM} from '@app/helpers/Constants';
import styles from '@app/_modules/account_gift_card/views/tablet/styles';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';

const GiftCardView = ({
  t,
  onCheckStatusAndBalance,
  giftCardAccount,
  loading,
  isChecked,
}) => {
  const [giftCardCode, setGiftCardCode] = useState('');

  // TODO : Styling & asked for code with expiration date
  const checkAvilability = expiration_date => {
    const ACTIVE = 'Active';
    const INACTIVE = 'Inactive';

    if (!expiration_date) {
      return ACTIVE;
    }

    let expDate = expiration_date.split(' ')[0].split('-');
    let newDate = new Date(expDate[2], expDate[1] - 1, expDate[0]);
    const expTimeStamp = newDate.getTime();

    if (Date.now() > expTimeStamp) {
      return INACTIVE;
    }

    return ACTIVE;
  };

  const GiftCardInformation = ({giftCardAccountResult}) => {
    return (
      <Section style={styles.sectionContainer}>
        <Section style={styles.fieldContainer}>
          <Label>{t('account_gift_card.view.code')}</Label>
          <Label>{giftCardAccountResult.code}</Label>
        </Section>
        <Section style={styles.fieldContainer}>
          <Label>{t('account_gift_card.view.availability')}</Label>
          <Label>
            {checkAvilability(giftCardAccountResult.expiration_date)}
          </Label>
        </Section>
        <Section style={styles.fieldContainer}>
          <Label>{t('account_gift_card.view.balance')}</Label>
          <Label>{numberFormat({value: giftCardAccountResult.balance})}</Label>
        </Section>
      </Section>
    );
  };

  return (
    <>
      <NavBar
        type={TYPE_APPBAR}
        useBack
        title={t('account_gift_card.title.giftCard')}
      />
      <Section style={styles.mainContainer}>
        <Show when={giftCardAccount && !loading}>
          <GiftCardInformation giftCardAccount={giftCardAccount} />
        </Show>
        <Show when={loading}>
          <Section style={styles.sectionContainer}>
            <ActivityIndicator />
          </Section>
        </Show>
        <Show when={!loading && isChecked && !giftCardAccount}>
          <Section style={[styles.sectionContainer, {alignItems: 'center'}]}>
            <Label>{t('account_gift_card.view.giftCardNotFound')}</Label>
            <Label>{t('account_gift_card.view.pleaseTryAnotherCode')}</Label>
          </Section>
        </Show>
        <Input
          type={TYPE_INPUT_CUSTOM}
          label={t('account_gift_card.label.enterGiftCard')}
          value={giftCardCode}
          onChangeText={setGiftCardCode}
        />
        <Button
          label={t('account_gift_card.btn.checkStatus')}
          styleProp={styles.checkButton}
          onPress={() => onCheckStatusAndBalance(giftCardCode)}
        />
      </Section>
    </>
  );
};

GiftCardView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // shows loading
  loading: PropTypes.bool,
  // function to check gift card code
  onCheckStatusAndBalance: PropTypes.func,
  // used to show gift card information
  giftCardAccount: PropTypes.string,
  // condition to show response label if exist or not
  isChecked: PropTypes.bool,
};

export default GiftCardView;
