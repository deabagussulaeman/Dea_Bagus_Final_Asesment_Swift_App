import React from 'react';
import {FlatList} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {numberFormat, shortenText} from '@app/helpers/General';
import {Colors, Mixins} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import {modules} from '@root/swift.config';
import PropTypes from 'prop-types';
import ToggleWishlist from '@app/components/ToggleWishlist';
import Button from '@app/components/Button';
import NavBar from '@app/components/NavBar';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import Show from '@app/components/Show';
import CustomInputQty from '@app/_modules/cart/atoms/CustomInputQty/index';
import FastImage from 'react-native-fast-image';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import ButtonRemoveItemFromCart from '@app/_modules/cart/atoms/ButtonRemoveItemFromCart';
import ModalUpdateCartItem from '@app/_modules/cart/atoms/ModalUpdateCartItem';
import styles from '@app/_modules/cart/views/mobile/styles';
import _ from 'lodash';
import {TYPENAME_BUNDLE, TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';
import {rxUserTheme} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';

export const WishListButton = props => {
  return <ToggleWishlist {...props} />;
};

const CartMobileView = ({
  t,
  cartItems,
  cartPrices,
  onNavigateToProductDetail,
  onNavigateToShipping,
  userType,
  loadingPrice,
  cartContextProps,
  useBack,
  wishlistItems,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  /**
   * ----------------------------------------- *
   * @function onRenderItem
   * @summary render cart item list
   * @return Component cart item
   * ----------------------------------------- *
   */
  const onRenderItem = ({item}) => {
    const url = _.get(item, 'product.url_key');
    const image = _.get(item, 'product.small_image.url');
    const name = _.get(item, 'product.name');
    const quantity = _.get(item, 'quantity');

    const id = _.get(item, 'id');
    const productID = _.get(item, 'product.id');
    let wishlistID = null;
    if (wishlistItems) {
      wishlistItems.forEach(wishlistItem => {
        if (wishlistItem.productId === productID) {
          wishlistID = wishlistItem.wishlistId;
        }
      });
    }
    const sku = _.get(item, 'sku');
    const bundleOptions = _.get(item, 'bundle_options');

    const isFreeItem = _.get(item, 'product.is_free_item');
    let price = _.get(
      item,
      'product.price_range.maximum_price.final_price.value',
    );

    // manual bundle price in cart
    if (item.product.__typename === TYPENAME_BUNDLE) {
      price = 0;
      bundleOptions?.map(option =>
        option?.values?.map(value => (price += value.price * value.quantity)),
      );

      if (price === 0) {
        bundleOptions.map(opt => {
          let findOption = item.product.items.find(
            op => op.option_id === opt.id,
          );
          opt.values.map(val => {
            let findValue = findOption.options.find(
              value => value.id === val.id,
            );
            const finalPrice =
              findValue.product.price_range.maximum_price.final_price;
            price = findValue
              ? price + finalPrice.value * findValue.quantity
              : price;
          });
        });
      }
    }

    return (
      <Section
        flex
        row
        width={Mixins.MAX_WIDTH}
        horizontalCenter
        verticalCenter
        paddingHorizontal={20}
        marginVertical={5}
        style={[styles.cartItemContainer, item.hide ? {display: 'none'} : {}]}>
        <Section
          horizontalStart
          width={Mixins.MAX_WIDTH * 0.35}
          paddingVertical={10}
          onPress={() => onNavigateToProductDetail(url)}>
          {image ? (
            <FastImage
              key={url}
              style={styles.cartItemImage}
              source={{
                uri: image,
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <Section
              width={Mixins.MAX_WIDTH * 0.3}
              height={150}
              backgroundColor={Colors.GRAY_LIGHT}
            />
          )}
        </Section>
        <Section horizontalStart verticalCenter flexNumber={3}>
          <Label style={styles.cartItemDetailText}>
            {shortenText(name, 35)}
          </Label>
          <Show when={bundleOptions}>
            <>
              {bundleOptions?.map(option =>
                option?.values?.map(value => (
                  <Label
                    size={10}
                    style={styles.cartItemDetailText}
                    key={value.id}>
                    {value.quantity} - {shortenText(value.label, 50)}
                  </Label>
                )),
              )}
            </>
          </Show>
          <Label style={styles.cartItemDetailText}>Qty: {quantity}</Label>
          <Label bold style={[styles.cartItemDetailText]}>
            {isFreeItem ? t('cart.view.free') : numberFormat({value: price})}
          </Label>

          <Section
            row
            spaceBetween
            horizontalCenter
            width={100}
            marginVertical={15}>
            {userType === 'customer' && (
              <WishListButton
                item={{...item, wishlistId: wishlistID}}
                productId={productID}
                wishlistItemId={wishlistID}
                productName={name}
                productSku={sku}
                productPrice={price}
                productCurrency={'IDR'}
                styleProp={styles.wishlistIcon}
                iconSize={normalize(15)}
              />
            )}

            {modules.cart.atoms.update_item_qty_modal.enable && (
              <ModalUpdateCartItem
                name={name}
                cartItemId={id}
                initialQuantity={quantity}
                propStyle={styles.cartItemActionIcon}>
                <SimpleLineIcons name="pencil" size={normalize(15)} />
              </ModalUpdateCartItem>
            )}

            {modules.cart.atoms.update_item_qty_input.enable && (
              <CustomInputQty
                initialQuantity={quantity}
                cartItemId={id}
                item={item}
              />
            )}
            <ButtonRemoveItemFromCart
              item={item}
              cartItemId={id}
              propStyle={styles.cartItemActionIcon}
              product={{
                currency:
                  item.price_range === undefined
                    ? item.currency
                    : item.price_range.maximum_price.final_price.currency,
                price:
                  item.price_range === undefined
                    ? item.price * item.quantity
                    : item.price_range.maximum_price.final_price.value *
                      item.quantity,
                id: item.productId,
                name: item.name,
                sku: item.sku,
              }}>
              <SimpleLineIcons name="trash" size={normalize(15)} />
            </ButtonRemoveItemFromCart>
          </Section>
        </Section>
      </Section>
    );
  };

  /**
   * ----------------------------------------- *
   * @component SubTotal
   * @summary Text Component for display price
   * @returns Components
   * ----------------------------------------- *
   */
  const SubTotal = () => {
    const price = _.get(cartPrices, 'subtotal_excluding_tax.value');
    const currency = _.get(cartPrices, 'subtotal_excluding_tax.currency');
    return (
      <Section
        horizontalCenter
        verticalCenter
        width={Mixins.MAX_WIDTH * 0.5}
        height={50}
        style={styles.subTotalSubContainer}>
        <Show when={loadingPrice || cartContextProps?.loading}>
          <ActivityIndicator />
        </Show>
        <Show when={!loadingPrice && !cartContextProps?.loading}>
          <Label bold>
            {price && typeof price === 'number'
              ? `${t('cart.view.subtotal')} ${'\n'}${numberFormat({
                  prefix: currency,
                  value: price,
                })}`
              : `${t('cart.view.subtotal')} ${'\n'}${numberFormat({value: 0})}`}
          </Label>
        </Show>
      </Section>
    );
  };

  return (
    <Section flex width={Mixins.MAX_WIDTH}>
      <NavBar
        type={TYPE_NAVBAR_CUSTOM}
        title={t('cart.title.cart')}
        useBack={useBack}
      />
      <FlatList
        style={[
          styles.listContainer,
          {opacity: cartContextProps?.loading ? 0.4 : 1},
        ]}
        data={cartItems}
        renderItem={onRenderItem}
        keyExtractor={item => item.id.toString()}
        removeClippedSubviews={false}
        ListEmptyComponent={
          cartItems === undefined || cartItems === null || loadingPrice ? (
            <Section marginTop={20}>
              <ActivityIndicator />
            </Section>
          ) : (
            <Section marginTop={20}>
              <Label center>{t('label.noData')}</Label>
            </Section>
          )
        }
      />
      <Section style={{flexDirection: 'row'}} width={Mixins.MAX_WIDTH}>
        <SubTotal />
        <Button
          borderRadius={0}
          disabled={!cartItems?.length || cartContextProps?.loading}
          onPress={cartContextProps?.loading ? () => {} : onNavigateToShipping}
          label={t('cart.btn.checkout')}
          width={Mixins.MAX_WIDTH * 0.5}
          textStyleProp={{
            ...styles.checkOutButtonText,
            color: getRxUserTheme === 'dark' ? Colors.BLACK : Colors.WHITE,
          }}
          loading={cartItems === undefined || cartItems === null}
          styleProp={[
            styles.checkOutButtonContainer,
            {
              backgroundColor:
                getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK,
            },
            !cartItems?.length && {backgroundColor: Colors.GRAY_DARK},
            {opacity: cartContextProps?.loading ? 0.4 : 1},
          ]}
        />
      </Section>
    </Section>
  );
};

CartMobileView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // used as a condition
  cartItems: PropTypes.any,
  // cartprice
  cartPrices: PropTypes.any,
  // function navigate to product detail
  onNavigateToProductDetail: PropTypes.func,
  // function btn checkout(go to shopping?)
  onNavigateToShipping: PropTypes.func,
  // used as condition
  userType: PropTypes.string,
};

export default CartMobileView;
