import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import styles from '@app/_modules/cart/atoms/CartItemsBlock/views/mobile/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';

const CartItem = ({item, index}) => {
  const url = _.get(item, 'product.url_key');
  const image = _.get(item, 'product.small_image.url');
  const name = _.get(item, 'product.name');
  const quantity = _.get(item, 'quantity');
  const price = _.get(
    item,
    'product.price_range.maximum_price.final_price.value',
  );
  return (
    <Section
      style={
        index === 0
          ? styles.cartItemContainerNoBorderTop
          : styles.cartItemContainer
      }>
      <Section style={styles.itemWrapper}>
        {image === '' ? (
          <Section flex height={50} width={50} />
        ) : (
          <FastImage
            key={url}
            style={styles.itemImages}
            source={{
              uri: image,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        )}
      </Section>
      <Section style={styles.itemDetails}>
        <Label style={styles.itemName}>{name}</Label>
        <Label style={styles.itemQty}>Qty : {quantity}</Label>
        <Label alignStart style={styles.itemPrice}>
          IDR
          {price}
        </Label>
      </Section>
    </Section>
  );
};

const CartItemsBlock = ({items}) => {
  if (items && items.length > 0) {
    return (
      <Section style={styles.cartItemWrapper}>
        <Section style={styles.cartItemTitle}>
          <Label style={{fontSize: 14, fontWeight: '500'}}>Items</Label>
          <Label style={{fontSize: 12, fontWeight: '500'}}>
            {items.length} items
          </Label>
        </Section>
        <Section style={styles.cartItemContent}>
          {items &&
            items.map((item, index) => (
              <CartItem key={item.id} index={index} item={item} />
            ))}
        </Section>
      </Section>
    );
  } else {
    return <ActivityIndicator />;
  }
};

CartItemsBlock.propTypes = {
  // product item
  items: PropTypes.array,
};

export default CartItemsBlock;
