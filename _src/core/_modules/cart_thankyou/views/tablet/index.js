import React from 'react';
import {Caption, Button} from 'react-native-paper';
import Label from '@app/components/Label';
import {Colors} from '@app/styles';
import Section from '@app/components/Section';
import PropTypes from 'prop-types';
import {rxUserTheme} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import AppStyles from '@app/styles/app';
import styles from '@app/_modules/cart_thankyou/views/tablet/styles';
import Show from '@app/components/Show';
import {BANK_TRANSFER} from '@app/helpers/Constants';

const ThankyouView = ({
  t,
  orderId,
  loadingReset,
  onResetToHome,
  onResetToConfirmPayment,
  getRxCartSelectedPaymentMethod,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  return (
    <Section
      style={[
        AppStyles.flexCenter,
        {
          backgroundColor: getRxUserTheme === 'dark' ? Colors.DARK : null,
        },
      ]}>
      <Section style={styles.mainContainer}>
        <Section style={styles.contentContainer}>
          <Label>{t('cart_thankyou.view.thankYou')}</Label>
          <Caption>
            {t('cart_thankyou.view.orderNumber')} {orderId}
          </Caption>
          <Show when={getRxCartSelectedPaymentMethod.code === BANK_TRANSFER}>
            <Section style={styles.containerBank}>
              <Label center>{t('cart_thankyou.view.bankTransfer')}</Label>
            </Section>
          </Show>
        </Section>
        <Show when={getRxCartSelectedPaymentMethod.code === BANK_TRANSFER}>
          <Button
            mode="contained"
            style={styles.containerBank}
            loading={loadingReset}
            disabled={loadingReset}
            onPress={onResetToConfirmPayment}>
            {t('cart_thankyou.label.confirmPayment')}
          </Button>
        </Show>
        <Button
          mode="contained"
          loading={loadingReset}
          disabled={loadingReset}
          onPress={onResetToHome}>
          {t('cart_thankyou.label.continueShopping')}
        </Button>
      </Section>
    </Section>
  );
};

ThankyouView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // order id
  orderId: PropTypes.any,
};

export default ThankyouView;
