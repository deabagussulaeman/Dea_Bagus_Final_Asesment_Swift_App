import React from 'react';
import {TouchableRipple} from 'react-native-paper';
import {Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import Label from '@app/components/Label';
import Show from '@app/components/Show';
import Section from '@app/components/Section';
import ToggleWishlist from '@app/components/ToggleWishlist';
import styles from '@app/components/_ProductItem/views/tablet/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors} from '@app/styles';
import {rxUserType} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import {numberFormat, shortenText} from '@app/helpers/General';
import {USER_GUEST, TYPENAME_SIMPLE, IN_STOCK} from '@app/helpers/Constants';
import ButtonAddItemToCart from '@app/_modules/cart/atoms/ButtonAddItemToCart';
import {useTranslation} from 'react-i18next';

const ProductItem = ({
  onPress,
  keyImage,
  image,
  name,
  currency,
  price,
  review,
  item,
  isProductImage = true,
  isProductName = true,
  isProductPrice = true,
  isProductReview = false,
  isProductWishlist = false,
  isProductAddtocart = false,
}) => {
  const imageSourceCondition = image !== '';
  const userType = useReactiveVar(rxUserType);
  const {t} = useTranslation();
  const getPriceRange = item?.price_range;
  const getMaxPrice = getPriceRange?.maximum_price;
  const getPriceCurrency = getMaxPrice?.final_price.currency;
  const getPriceFinalValue = getMaxPrice?.final_price.value;

  return (
    <TouchableRipple
      key={keyImage}
      onPress={onPress}
      style={styles.frameProductItem}>
      <Section>
        <Show when={isProductImage}>
          <Show when={imageSourceCondition}>
            <FastImage
              key={keyImage}
              style={styles.itemImage}
              resizeMode={FastImage.resizeMode.contain}
              source={{
                uri: image.toString(),
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable,
              }}
            />
          </Show>
          <Show when={!imageSourceCondition}>
            <Image
              source={require('@app/assets/images/placeholder.png')}
              style={styles.itemImage}
            />
          </Show>
        </Show>
        <Show when={isProductName}>
          <Section height={70}>
            <Label xxsmall style={styles.productItemName}>
              {shortenText(name, 35)}
            </Label>
          </Section>
        </Show>

        <Show when={isProductPrice}>
          <Label small style={styles.productItemPrice}>
            {numberFormat({
              prefix: currency,
              value: price,
              decimals: 0,
            })}
          </Label>
        </Show>

        <Show
          when={
            isProductReview || (userType !== USER_GUEST && isProductWishlist)
          }>
          <Section
            key={1}
            keyIndex={1}
            style={{marginHorizontal: 5, marginVertical: 10}}
            row
            spaceBetween>
            <Show when={isProductReview}>
              <Section row>
                <Section style={{marginRight: 5}}>
                  <Icon
                    name={review ? 'star' : 'star-o'}
                    size={12}
                    color={Colors.PRIMARY}
                  />
                </Section>
                <Section>
                  <Label size={10}>
                    {review ? (parseInt(review) / 20).toFixed(1) : 0}
                  </Label>
                </Section>
              </Section>
            </Show>
            <Show when={userType !== USER_GUEST && isProductWishlist}>
              <Section style={{marginRight: 5}}>
                <ToggleWishlist productName={name} iconSize={12} item={item} />
              </Section>
            </Show>
          </Section>
        </Show>

        <Show when={isProductAddtocart}>
          <Section horizontalCenter>
            <Show when={item.__typename === TYPENAME_SIMPLE}>
              <ButtonAddItemToCart
                showIncreaseDecrease={false}
                item={item}
                type={item.__typename}
                id={item.id}
                name={item.name}
                productPrice={getPriceFinalValue}
                productCurrency={getPriceCurrency}
                disabled={item.stock_status !== IN_STOCK}
                sku={item.sku}
                propStyle={{backgroundColor: Colors.PRIMARY, width: 100}}>
                <Label color={Colors.WHITE} size={8}>
                  {item.stock_status === IN_STOCK
                    ? t('label.addCart')
                    : t('label.outOfStock')}
                </Label>
              </ButtonAddItemToCart>
            </Show>
            <Show when={item.__typename !== TYPENAME_SIMPLE}>
              <ButtonAddItemToCart
                showIncreaseDecrease={false}
                onPress={onPress}
                propStyle={{backgroundColor: Colors.PRIMARY, width: 100}}>
                <Label color={Colors.WHITE} size={8}>
                  {t('label.detail')}
                </Label>
              </ButtonAddItemToCart>
            </Show>
          </Section>
        </Show>
      </Section>
    </TouchableRipple>
  );
};

ProductItem.propTypes = {
  // @summary image url of product
  image: PropTypes.string.isRequired,
  // @summary name of product
  name: PropTypes.string.isRequired,
  // @summary price of product
  price: PropTypes.number,
  // function to execute onPress
  onPress: PropTypes.func,
  // url key
  keyImage: PropTypes.string,
  // currency
  currency: PropTypes.string,
  // shows rating review
  review: PropTypes.string,
  // shows item
  item: PropTypes.object,
  // use to determined whether to shows product item image
  isProductImage: PropTypes.bool,
  // use to determined whether to shows product item name
  isProductName: PropTypes.bool,
  // use to determined whether to shows product item price
  isProductPrice: PropTypes.bool,
  // use to determined whether to shows product item review
  isProductReview: PropTypes.bool,
  // use to determined whether to shows product item wishlist
  isProductWishlist: PropTypes.bool,
  // use to determined whether to shows product item to cart btn
  isProductAddtocart: PropTypes.bool,
};

export default ProductItem;
