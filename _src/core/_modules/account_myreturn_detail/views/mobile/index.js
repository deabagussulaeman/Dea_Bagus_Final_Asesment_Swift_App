import React from 'react';
import {ScrollView} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {normalize} from '@app/styles/mixins';
import {Colors, Mixins} from '@app/styles';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import NavBar from '@app/components/NavBar';
import Show from '@app/components/Show';
import Button from '@app/components/Button';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import RMAFormModal from '@app/_modules/account/atoms/RMAFormModal';
import styles from '@app/_modules/account_myreturn_detail/views/mobile/styles';
import {TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';

const OrderStatus = ({label, status, index}) => {
  return (
    <Section>
      <Section
        style={[
          {
            borderColor: status >= index ? Colors.PRIMARY : Colors.BLACK,
          },
          styles.orderStatusItemContainer,
        ]}
      />
      <Section
        style={{
          flex: 1,
          flexDirection: 'row',
        }}>
        <Label center small style={styles.orderStatusItemText}>
          {label}
        </Label>
      </Section>
    </Section>
  );
};

const OrderStatusLine = ({status, index}) => {
  return (
    <Section
      style={[
        {borderColor: status >= index ? Colors.PRIMARY : Colors.BLACK},
        styles.orderStatusLine,
      ]}
    />
  );
};

const OrderItemDetail = ({t, item}) => {
  const {detail, status} = item;
  const {
    shipping_address,
    shipping_methods,
    payment,
    subtotal,
    grand_total,
    global_currency_code,
  } = detail[0];
  const {firstname, lastname, city, postcode, region, street, telephone} =
    shipping_address;
  const {shipping_description} = shipping_methods;
  const {shipping_amount, payment_additional_info} = payment;
  const {method_title: payment_method_title, virtual_account} =
    payment_additional_info;

  let orderStatus = 0;

  switch (status) {
    case 'pending_payment':
      orderStatus = -1;
      break;
    case 'canceled':
      orderStatus = -2;
      break;
    case 'new':
      orderStatus = 0;
      break;
    case 'processing':
      orderStatus = 1;
      break;
    // TODO : double check available statuses
    case 'shipped':
      orderStatus = 2;
      break;
    case 'complete':
      orderStatus = 3;
      // orderStatus = 2;
      break;
    default:
      orderStatus = 0;
      break;
  }

  return (
    <Section style={styles.detailsMainContainer}>
      <Section style={styles.priceBlockContainer}>
        {/* price block */}
        <Section
          style={{
            marginBottom: normalize(10),
          }}>
          <Section style={styles.rowContainer}>
            <Label>{t('account_myreturn_detail.view.subtotal')}</Label>
            <Label>
              {global_currency_code} {subtotal}
            </Label>
          </Section>
          <Section style={styles.rowContainer}>
            <Label>{t('account_myreturn_detail.view.shipping')}</Label>
            <Label>
              {global_currency_code} {shipping_amount}
            </Label>
          </Section>
          <Section style={styles.rowContainer}>
            <Label bold>{t('account_myreturn_detail.view.total')}</Label>
            <Label bold>
              {global_currency_code} {grand_total}
            </Label>
          </Section>
        </Section>
        {/* end of price block */}

        {/* Order status block */}
        <Section style={styles.orderStatusContainer}>
          <OrderStatus
            label={
              orderStatus < 0
                ? t('account_myreturn_detail.label.waitingConfirmation')
                : t('account_myreturn_detail.label.purchased')
            }
            index={0}
            status={orderStatus}
          />
          <OrderStatusLine index={1} status={orderStatus} />
          <OrderStatus label="Processing" index={1} status={orderStatus} />
          <OrderStatusLine index={2} status={orderStatus} />
          <OrderStatus label="Shipped" index={2} status={orderStatus} />
          <OrderStatusLine index={3} status={orderStatus} />
          <OrderStatus label="Complete" index={3} status={orderStatus} />
        </Section>
        {/* end of status block */}

        {/* Address Information block */}
        <Section
          style={[styles.spacingMargin, {maxWidth: Mixins.MAX_WIDTH * 0.6}]}>
          <Label bold>
            {t('account_myreturn_detail.view.addressInformation')}
          </Label>
          <Label small>
            {firstname} {lastname}
          </Label>
          <Label small>{street}</Label>
          <Label small>
            {city}, {region}, {postcode}
          </Label>
          <Label small>{telephone}</Label>
        </Section>
        {/* end of address information block */}

        {/* Shipping Method block */}
        <Section style={styles.spacingMargin}>
          <Label bold>{t('account_myreturn_detail.view.shippingMethod')}</Label>
          <Label small>{shipping_description}</Label>
        </Section>
        {/* end of shipping method block */}

        {/* Payment Method block */}
        <Section style={styles.spacingMargin}>
          <Label bold>{t('account_myreturn_detail.view.paymentMethod')}</Label>
          <Label small>{payment_method_title}</Label>
          {virtual_account ? <Label small>{virtual_account}</Label> : null}
        </Section>
        {/* end of Payment method block */}
      </Section>
    </Section>
  );
};

const MyReturnDetailView = ({
  item,
  onRequestReturn,
  rmaFormData,
  formDataLoading,
  rmaFormVisibility,
  setRmaFormVisibility,
}) => {
  let itemFinal = item.ordersFilter.data;
  let isEmptyData = itemFinal.length < 1;
  const {t} = useTranslation();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <NavBar
        type={TYPE_NAVBAR_CUSTOM}
        title={t('account_myreturn_detail.title.orderDetail')}
      />
      {isEmptyData && (
        <Label>{t('account_myreturn_detail.view.noDataFound')}</Label>
      )}
      {!isEmptyData && (
        <ScrollView>
          <OrderItemDetail item={itemFinal[0]} t={t} />
          <Show when={itemFinal[0].detail[0].aw_rma.status}>
            <Section style={{alignItems: 'center'}}>
              <Show when={formDataLoading}>
                <ActivityIndicator color="red" />
              </Show>
              <Show when={!formDataLoading}>
                <Button
                  label={t('account_myreturn_detail.btn.requestReturn')}
                  styleProp={styles.returnRequestButton}
                  textStyleProp={styles.returnRequestButtonText}
                  onPress={() => onRequestReturn()}
                />
              </Show>
            </Section>
          </Show>
        </ScrollView>
      )}
      <Show when={rmaFormData}>
        <RMAFormModal
          orderNumber={itemFinal[0].order_number}
          rmaFormData={rmaFormData}
          visible={rmaFormVisibility}
          setVisible={setRmaFormVisibility}
        />
      </Show>
    </SafeAreaView>
  );
};

MyReturnDetailView.propTypes = {
  // data
  item: PropTypes.array,
  // as condition
  formDataLoading: PropTypes.bool,
  // data in formmodal
  rmaFormData: PropTypes.array,
  // shows visibility
  rmaFormVisibility: PropTypes.bool,
  // func in button request return
  onRequestReturn: PropTypes.func,
  // set visibility
  setRmaFormVisibility: PropTypes.bool,
};

export default MyReturnDetailView;
