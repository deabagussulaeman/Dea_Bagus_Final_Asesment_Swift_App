import React from 'react';
import {ScrollView} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {Colors, Mixins} from '@app/styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import OrderStatus from '@app/_modules/account_purchases_detail/atoms/OrderStatus';
import OrderStatusLine from '@app/_modules/account_purchases_detail/atoms/OrderStatusLine';
import RMAFormModal from '@app/_modules/account/atoms/RMAFormModal';
import ShippingDetail from '@app/_modules/account/atoms/ShippingDetail';
import Button from '@app/components/Button';
import NavBar from '@app/components/NavBar';
import Show from '@app/components/Show';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import {useReactiveVar} from '@apollo/client';
import styles from '@app/_modules/account_purchases_detail/views/tablet/styles';
import {rxUserTheme} from '@app/services/cache';
import {TYPE_APPBAR} from '@app/helpers/Constants';

const AddressInformationBlock = ({address, title}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const {firstname, lastname, city, postcode, region, street, telephone} =
    address;

  return (
    <Section
      marginVertical={10}
      horizontalStart
      width="100%"
      backgroundColor={
        getRxUserTheme === 'dark' ? Colors.GRAY_DARK : Colors.GRAY_LIGHT
      }>
      <Label bold style={styles.blockHeaderText}>
        {title}
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
  );
};

const ProductItemsBlock = ({t, items, global_currency_code}) => {
  return (
    <Section
      borderRadius={15}
      marginVertical={10}
      horizontalCenter
      verticalCenter
      paddingHorizontal={10}
      paddingVertical={10}>
      <Label alignStart bold style={styles.productItemsTitle}>
        {t('account_purchases_detail.view.items')}
      </Label>
      {items.map((item, index) => {
        return (
          <Section row spaceBetween width={'100%'}>
            <Label center alignCenter style={{width: '10%'}}>
              {index + 1}.
            </Label>
            <Label alignCenter style={{width: '40%'}}>
              {item.name}
            </Label>
            <Label alignCenter style={{width: '15%'}}>
              {item.qty_ordered} {t('account_purchases_detail.view.pcs')}
            </Label>
            <Label alignCenter style={{width: '25%'}}>
              {global_currency_code} {item.price}
            </Label>
          </Section>
        );
      })}
    </Section>
  );
};

const OrderItemDetail = ({t, item}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  const {detail, status} = item;
  const {
    billing_address,
    shipping_address,
    shipping_methods,
    items,
    payment,
    subtotal,
    grand_total,
    global_currency_code,
    discount_amount,
  } = detail[0];

  const {shipping_description, shipping_detail} = shipping_methods;
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
    case 'ready_to_ship':
      orderStatus = 2;
      break;
    case 'complete':
      orderStatus = 3;
      break;
    default:
      orderStatus = 0;
      break;
  }

  let backgroundColor =
    getRxUserTheme === 'dark' ? Colors.GRAY_DARK : Colors.GRAY_LIGHT;

  return (
    <Section flex horizontalCenter verticalCenter marginVertical={20}>
      <Section
        paddingHorizontal={30}
        paddingVertical={10}
        backgroundColor={backgroundColor}
        borderRadius={15}
        marginTop={30}
        width={Mixins.MAX_WIDTH * 0.8}
        horizontalCenter
        verticalCenter>
        {/* price block */}
        <Section width={'100%'} marginVertical={10}>
          <Section
            width={'100%'}
            row
            spaceBetween
            backgroundColor={backgroundColor}>
            <Label>{t('account_purchases_detail.view.subtotal')}</Label>
            <Label>
              {global_currency_code} {subtotal}
            </Label>
          </Section>
          <Section
            width={'100%'}
            row
            spaceBetween
            backgroundColor={backgroundColor}>
            <Label>{t('account_purchases_detail.view.shipping')}</Label>
            <Label>
              {global_currency_code} {shipping_amount}
            </Label>
          </Section>
          <Section
            width={'100%'}
            row
            spaceBetween
            backgroundColor={backgroundColor}>
            <Label>{t('account_purchases_detail.view.discount')}</Label>
            <Label>
              {global_currency_code} {discount_amount}
            </Label>
          </Section>
          <Section
            width={'100%'}
            row
            spaceBetween
            backgroundColor={backgroundColor}>
            <Label bold>{t('account_purchases_detail.view.total')}</Label>
            <Label bold>
              {global_currency_code} {grand_total}
            </Label>
          </Section>
        </Section>
        {/* end of price block */}

        {/* Product Items block */}
        <ProductItemsBlock
          t={t}
          items={items}
          global_currency_code={global_currency_code}
        />
        {/* end of product items block */}

        {/* Billing Address Information block */}
        <Show when={!shipping_address}>
          <AddressInformationBlock
            address={billing_address}
            title="Billing Address"
          />
        </Show>
        {/* end of billing address information block */}
        <Show when={shipping_address}>
          {/* Shipping Address Information block */}
          <AddressInformationBlock
            address={shipping_address}
            title="Shipping Address &amp; Billing Address"
          />
          {/* end of shipping address information block */}

          {/* Shipping Method block */}
          <Section
            width={'100%'}
            horizontalStart
            marginVertical={10}
            backgroundColor={backgroundColor}>
            <Label bold style={styles.blockHeaderText}>
              {t('account_purchases_detail.view.shippingMethod')}
            </Label>
            <Label small>{shipping_description}</Label>
            <ShippingDetail
              shipping_description={shipping_description}
              shipping_detail={shipping_detail}
            />
          </Section>
          {/* end of shipping method block */}
        </Show>

        {/* Order status block */}
        <Show when={shipping_address}>
          {/* Order status is canceled */}
          {orderStatus === -2 ? (
            <Section
              flex
              borderRadius={15}
              marginVertical={10}
              horizontalCenter
              verticalCenter
              paddingHorizontal={140}
              paddingVertical={20}
              row>
              <OrderStatus
                label={t('account_purchases_detail.label.waitingConfirmation')}
                index={0}
                status={orderStatus}
              />
              <OrderStatusLine />
              <OrderStatus
                label={t('account_purchases_detail.label.canceled')}
                index={-2}
                status={orderStatus}
              />
            </Section>
          ) : (
            <Section
              flex
              borderRadius={15}
              marginVertical={10}
              horizontalCenter
              verticalCenter
              paddingHorizontal={40}
              paddingVertical={20}
              row>
              <OrderStatus
                label={
                  orderStatus < 0
                    ? t('account_purchases_detail.label.waitingConfirmation')
                    : t('account_purchases_detail.label.purchased')
                }
                index={0}
                status={orderStatus}
              />
              <OrderStatusLine />
              <OrderStatus
                label={t('account_purchases_detail.label.processing')}
                index={1}
                status={orderStatus}
              />
              <OrderStatusLine />
              <OrderStatus
                label={t('account_purchases_detail.label.readyToShip')}
                index={2}
                status={orderStatus}
              />
              <OrderStatusLine />
              <OrderStatus
                label={t('account_purchases_detail.label.shipped')}
                index={3}
                status={orderStatus}
              />
            </Section>
          )}
        </Show>
        {/* end of status block */}

        {/* Payment Method block */}
        <Section
          width={'100%'}
          horizontalStart
          marginVertical={10}
          backgroundColor={backgroundColor}>
          <Label bold style={styles.blockHeaderText}>
            {t('account_purchases_detail.view.paymentMethod')}
          </Label>
          <Label small>{payment_method_title}</Label>
          {virtual_account ? <Label small>{virtual_account}</Label> : null}
        </Section>
        {/* end of Payment method block */}
      </Section>
    </Section>
  );
};

const AccountPurchasesDetailTabletView = ({
  t,
  item,
  onRequestReturn,
  rmaFormData,
  formDataLoading,
  rmaFormVisibility,
  setRmaFormVisibility,
}) => {
  let itemFinal = item.data.ordersFilter.data;
  let isEmptyData = itemFinal.length < 1;

  return (
    <SafeAreaView style={{flex: 1}}>
      <NavBar
        type={TYPE_APPBAR}
        useBack
        title={t('account_purchases_detail.title.orderDetail')}
      />
      <Section safe horizontalCenter verticalCenter flex>
        {isEmptyData && (
          <Label>{t('account_purchases_detail.view.noDataFound')}</Label>
        )}
        {!isEmptyData && (
          <ScrollView>
            <OrderItemDetail item={itemFinal[0]} t={t} />
            <Show when={itemFinal[0]?.detail[0]?.aw_rma.status}>
              <Section horizontalCenter verticalCenter>
                <Show when={formDataLoading}>
                  <ActivityIndicator color="red" />
                </Show>
                <Show when={!formDataLoading}>
                  <Button
                    label={t('account_purchases_detail.btn.requestReturn')}
                    styleProp={styles.requestReturnButton}
                    textStyleProp={styles.requestReturnButtonText}
                    onPress={() => onRequestReturn()}
                  />
                </Show>
              </Section>
            </Show>
          </ScrollView>
        )}
        <Show when={rmaFormData}>
          <RMAFormModal
            orderNumber={itemFinal[0]?.order_number}
            rmaFormData={rmaFormData}
            visible={rmaFormVisibility}
            setVisible={setRmaFormVisibility}
          />
        </Show>
      </Section>
    </SafeAreaView>
  );
};

AccountPurchasesDetailTabletView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
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
  setRmaFormVisibility: PropTypes.func,
};
export default AccountPurchasesDetailTabletView;
