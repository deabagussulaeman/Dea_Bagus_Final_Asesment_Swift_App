import React from 'react';
import {ScrollView, SafeAreaView, FlatList} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {numberFormat} from '@app/helpers/General';
import {Mixins, Colors} from '@app/styles/index';
import {
  TYPENAME_BUNDLE,
  TYPE_MODAL_PAYMENT_SNAP,
  TYPE_NUMBER,
  TYPE_APPBAR,
} from '@app/helpers/Constants';
import {rxUserTheme} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import Button from '@app/components/Button/index';
import NavBar from '@app/components/NavBar/index';
import Show from '@app/components/Show';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import AtomBlockShippingAddress from '@app/_modules/cart_checkout/atoms/BlockShippingAddress/index';
import AtomBlockShippingMethod from '@app/_modules/cart_checkout/atoms/BlockShippingMethod/index';
import AtomBlockPaymentMethod from '@app/_modules/cart_checkout/atoms/BlockPaymentMethod/index';
import AtomBlockPaymentOthers from '@app/_modules/cart_checkout/atoms/BlockPaymentOthers/index';
import styles from '@app/_modules/cart_checkout/views/mobile/styles';
import AppModal from '@app/components/_AppModal/index';
import Icon from 'react-native-vector-icons/Feather';
import _ from 'lodash';

function CartCheckoutMobileView({
  t,
  cart,
  isCart,
  isLoadingSnap,
  appliedRewardPoints,
  onProcessPlaceOrder,
  shippingAddressLoading,
  shippingMethodLoading,
  isEmptyCart,
  dataPrices,
  expand,
  isLoadingPlaceOrder,
  onPressExpand,
  _onSnapModalLoad,
  _onSnapModalClose,
  _onSnapModalError,
  _onSnapNavigationStateChange,
}) {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const placeOrderColor =
    getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY;
  const placeOrderTextColor =
    getRxUserTheme === 'dark' ? Colors.BLACK : Colors.WHITE;

  const onRenderSummary = ({item}) => {
    const name = _.get(item, 'product.name');
    const quantity = _.get(item, 'quantity');
    const isFreeItem = _.get(item, 'product.is_free_item');
    const price =
      _.get(item, 'prices.price.value') ||
      _.get(item, 'product.price_range.maximum_price.final_price.value');

    return (
      <Section
        flex
        row
        width={Mixins.MAX_WIDTH}
        paddingHorizontal={20}
        marginVertical={5}
        style={styles.cartItemContainer}>
        <Section horizontalStart flexNumber={3}>
          <Section width={Mixins.MAX_WIDTH - 40} row spaceBetween>
            <Label
              style={[styles.cartItemTitle, {maxWidth: Mixins.MAX_WIDTH / 2}]}>
              {name}
            </Label>
            <Show when={item.product.__typename !== TYPENAME_BUNDLE}>
              <Label style={[styles.cartItemDetailText]}>
                {isFreeItem
                  ? t('cart_checkout.label.free')
                  : numberFormat({value: price})}
              </Label>
            </Show>
          </Section>
          <Show when={item.bundle_options?.length > 0}>
            {item.bundle_options?.map(bundle => (
              <Section>
                <Label bold style={styles.cartItemDetailText}>
                  {bundle.label}:
                </Label>
                {bundle.values.map(value => (
                  <Section width={Mixins.MAX_WIDTH - 40} row spaceBetween>
                    <Section style={{maxWidth: Mixins.MAX_WIDTH / 2}}>
                      <Label style={styles.cartItemDetailText}>
                        {`${value.label}`}
                      </Label>
                    </Section>
                    <Section>
                      <Label>{numberFormat({value: value.price})}</Label>
                    </Section>
                  </Section>
                ))}
              </Section>
            ))}
          </Show>
          <Label style={styles.cartItemDetailText}>Qty: {quantity}</Label>
        </Section>
      </Section>
    );
  };

  /**
   * ---------------------------------------------------- *
   * @function ListEmptyComponent
   * @summary for list empty component of flatlist
   * @returns {view}
   * ---------------------------------------------------- *
   */
  const ListEmptyComponent = () => {
    if (isEmptyCart) {
      return <ActivityIndicator />;
    }
    return <Label center>{t('noData')}</Label>;
  };

  /**
   * ----------------------------------------- *
   * @component SubTotal
   * @summary Label Component for display price
   * @returns Components
   * ----------------------------------------- *
   */
  const SubTotal = () => {
    return (
      <Section
        horizontalCenter
        width={Mixins.MAX_WIDTH}
        height={!expand && 80}
        style={[styles.subTotalSubContainer, {maxHeight: 550}]}>
        <Show when={!expand}>
          <Section marginBottom={10} onPress={onPressExpand}>
            <Icon
              name={'chevron-up'}
              size={25}
              color={
                getRxUserTheme === 'dark' ? Colors.WHITE : Colors.GRAY_SMOOTH4
              }
            />
          </Section>
        </Show>
        <Show when={expand}>
          <Section marginBottom={10} onPress={onPressExpand}>
            <Icon
              name={'chevron-down'}
              size={25}
              color={
                getRxUserTheme === 'dark' ? Colors.WHITE : Colors.GRAY_SMOOTH4
              }
            />
          </Section>
          <ScrollView>
            <Section>
              <FlatList
                style={styles.listContainer}
                data={cart}
                renderItem={onRenderSummary}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={ListEmptyComponent}
              />
              <Section
                paddingLeft={20}
                width={Mixins.MAX_WIDTH - 20}
                paddingVertical={10}
                marginVertical={10}
                style={styles.subtotal}>
                <Section row spaceBetween>
                  <Label xlarge>{t('subtotal')}</Label>
                  <Label xlarge>
                    {numberFormat({
                      prefix: dataPrices.subtotal_excluding_tax.currency,
                      value: dataPrices.subtotal_excluding_tax.value,
                    })}
                  </Label>
                </Section>
                <Show when={dataPrices.discounts}>
                  {dataPrices?.discounts?.map((discount, key) => (
                    <Section row spaceBetween key={key}>
                      <Label xlarge style={{maxWidth: Mixins.MAX_WIDTH / 2}}>
                        {discount.label}
                      </Label>
                      <Label xlarge style={{maxWidth: Mixins.MAX_WIDTH / 2}}>
                        {'- '}
                        {numberFormat({
                          prefix: discount.amount.currency,
                          value: discount.amount.value,
                        })}
                      </Label>
                    </Section>
                  ))}
                </Show>
                <Show
                  when={
                    appliedRewardPoints &&
                    appliedRewardPoints?.is_use_reward_points
                  }>
                  <Section row spaceBetween>
                    <Label xlarge style={{maxWidth: Mixins.MAX_WIDTH / 2}}>
                      {t('cart_checkout.label.myPoint')}
                    </Label>
                    <Label xlarge style={{maxWidth: Mixins.MAX_WIDTH / 2}}>
                      {'- '}
                      {numberFormat({
                        value: appliedRewardPoints?.reward_points,
                        decimals: 0,
                      })}
                    </Label>
                  </Section>
                </Show>
              </Section>
            </Section>
          </ScrollView>
        </Show>
        <Show
          when={
            dataPrices && typeof dataPrices.grand_total.value === TYPE_NUMBER
          }>
          <Section marginVertical={10}>
            <Label xlarge bold>{`Total ${numberFormat({
              prefix: dataPrices.grand_total.currency,
              value: dataPrices.grand_total.value,
            })}`}</Label>
          </Section>
        </Show>
        <Show
          when={
            !dataPrices && typeof dataPrices.grand_total.value !== TYPE_NUMBER
          }>
          <Label bold>{t('loading')}</Label>
        </Show>
      </Section>
    );
  };

  const isLoadingButtonCheckout =
    shippingAddressLoading ||
    shippingMethodLoading ||
    isCart?.loadingButtonOrder;
  // MAIN
  if (cart && cart.length > 0) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <NavBar
          useBack
          useWhite
          center
          title={t('cart_checkout.title.checkout')}
          titleStyle={styles.navbarTitleStyle}
          type={TYPE_APPBAR}
        />
        <ScrollView
          style={styles.mainContainer}
          contentContainerStyle={styles.containerStyle}>
          {/* SHIPPING ADDRESS */}
          <AtomBlockShippingAddress />
          {/* SHIPPING METHOD */}
          <AtomBlockShippingMethod />
          {/* PAYMENT METHOD */}
          <AtomBlockPaymentMethod />
          {/* PAYMENT OTHERS */}
          <AtomBlockPaymentOthers />
        </ScrollView>
        <Section
          horizontalCenter
          style={{flexDirection: 'column'}}
          width={Mixins.MAX_WIDTH}>
          <SubTotal />
          <Button
            loading={isLoadingPlaceOrder || isLoadingButtonCheckout}
            loadingColor={Colors.WHITE}
            disabled={isLoadingButtonCheckout}
            onPress={
              isLoadingPlaceOrder || isLoadingButtonCheckout
                ? false
                : onProcessPlaceOrder
            }
            textStyleProp={{
              color: placeOrderTextColor,
              fontWeight: 'bold',
              fontSize: Mixins.normalize(10),
            }}
            label={t('cart_checkout.label.placeOrder')}
            width={Mixins.MAX_WIDTH * 0.9}
            styleProp={[
              styles.paymentButtonContainer,
              {
                backgroundColor:
                  isLoadingPlaceOrder || isLoadingButtonCheckout
                    ? Colors.GRAY_MEDIUM
                    : placeOrderColor,
              },
            ]}
          />
        </Section>
        <AppModal
          type={TYPE_MODAL_PAYMENT_SNAP}
          show={isCart.showSnap}
          showWebviewLoader={isLoadingSnap}
          onWebviewLoad={_onSnapModalLoad}
          onWebviewClose={_onSnapModalClose}
          onWebviewNavigationStateChange={_onSnapNavigationStateChange}
          onWebviewError={_onSnapModalError}
        />
      </SafeAreaView>
    );
  } else {
    return <ActivityIndicator />;
  }
}

export default CartCheckoutMobileView;
