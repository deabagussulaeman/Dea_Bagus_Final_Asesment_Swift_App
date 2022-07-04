import React from 'react';
import {Capitalize, numberFormat} from '@app/helpers/General';
import {Colors, Mixins} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import {ScrollView} from 'react-native';
import {useReactiveVar} from '@apollo/client';
import {modules} from '@root/swift.config';
import {ActivityIndicator, Colors as ColorsPaper} from 'react-native-paper';
import {rxUserTheme} from '@app/services/cache';
import {TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';
import {
  IN_STOCK,
  TYPENAME_BUNDLE,
  TYPENAME_CONFIGURABLE,
  USER_GUEST,
} from '@app/helpers/Constants';
import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';
import Show from '@app/components/Show';
import Loader from '@app/components/Loader/index';
import Section from '@root/_src/core/components/Section/index';
import SocialShareBlock from '@app/components/SocialShareBlock/index';
import BundleProduct from '@app/_modules/product_detail/atoms/BundleProduct';
import ConfigurableOptions from '@app/_modules/product_detail/atoms/ConfigurableOptions';
import ProductDetailBlock from '@app/_modules/product_detail/atoms/ProductDetailBlock/index';
import ToggleWishlist from '@app/components/ToggleWishlist';
import NavBar from '@app/components/NavBar';
import AtomNavBarRight from '@app/_modules/product_detail/atoms/NavBarRight';
import ButtonAddItemToCart from '@app/_modules/cart/atoms/ButtonAddItemToCart/index';
import styles from '@app/_modules/product_detail/views/mobile/styles';
import Label from '@app/components/Label';
import PropTypes from 'prop-types';
import _ from 'lodash';

export const WishListButton = props => {
  return <ToggleWishlist {...props} />;
};

const ProductDetailMobileView = ({
  t,
  loading,
  product,
  userType,
  productReviews,
  totalReview,
  refetchProductReviews,
  refetchWishlist,
  getPriceRange,
  getPriceCurrency,
  getPriceRegularValue,
  getPriceFinalValue,
  getDiscountPercent,
  getPriceTiers,
  isShowPriceTiers,
  isSamePrice,
  isProductReady,
  imageUrl,
  skuProduct,
  visibleImageView,
  selectedColor,
  selectedSize,
  stockStatus,
  selectedOptions,
  bundleItemsCount,
  setSkuProduct,
  onItemClickPreviewImage,
  setSelectedColor,
  setSelectedSize,
  setSelectedOptions,
  setBundleItemsCount,
  cartCount,
  productUrlKey,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  /**
   * ----------------------------------------- *
   * @component PriceRow
   * @param {Object} product attributes
   * @summary Section price on PDP
   * @returns Components
   * ----------------------------------------- *
   */
  const PriceRow = () => {
    return (
      <Section>
        <Section row marginVertical={10}>
          <Show when={getDiscountPercent && getDiscountPercent > 0}>
            <Section
              width={60}
              height={60}
              border={2}
              borderColor={
                getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK
              }
              borderRadius={5}
              marginHorizontal={10}
              horizontalCenter
              verticalCenter>
              <Label
                color={
                  getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY
                }
                small>
                {getDiscountPercent?.toFixed(0)}%
              </Label>
              <Label
                color={
                  getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY
                }
                small>
                Off
              </Label>
            </Section>
          </Show>

          <Show when={getPriceRange}>
            <Section horizontalStart>
              <Show when={!isSamePrice}>
                <Label
                  color={
                    getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY
                  }
                  lineThrough
                  small>
                  {numberFormat({
                    prefix: getPriceCurrency,
                    value: getPriceRegularValue?.toFixed(2),
                    decimals: 2,
                  })}
                </Label>
              </Show>
              <Label
                color={
                  getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY
                }
                large
                bold>
                {numberFormat({
                  prefix: getPriceCurrency,
                  value: getPriceFinalValue,
                  decimals: 2,
                })}
              </Label>
            </Section>
          </Show>
        </Section>
        <Show when={isShowPriceTiers}>
          {getPriceTiers?.map(tier => (
            <Section>
              <Label>
                {_.startCase(t('product_detail.label.buy'))}
                {' ' + tier.quantity + ' '}
                {t('product_detail.label.for')}{' '}
                {numberFormat({
                  prefix: getPriceCurrency,
                  value: tier.final_price.value,
                  decimals: 2,
                })}{' '}
                {t('product_detail.label.eachSave')}{' '}
                {tier.discount.percent_off + '%'}
              </Label>
            </Section>
          ))}
        </Show>
      </Section>
    );
  };

  return (
    <>
      <NavBar
        type={TYPE_NAVBAR_CUSTOM}
        useBack
        childrenRight={<AtomNavBarRight cartCount={cartCount} />}
      />
      <Show when={!loading && !product.id}>
        <Section
          horizontalCenter
          verticalCenter
          flex
          style={{textAlign: 'center'}}>
          <Label>{t('product_detail.productNotFound')}</Label>
          <Label>{'url : ' + productUrlKey}</Label>
        </Section>
      </Show>
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Loader loading={loading} />
        <Show when={!loading && product.id}>
          <Section flex horizontalStart>
            <Section
              horizontalCenter
              verticalCenter
              onPress={() => onItemClickPreviewImage(true)}>
              <Show when={product.image}>
                <FastImage
                  key={skuProduct}
                  style={styles.productImage}
                  resizeMode={FastImage.resizeMode.contain}
                  source={{
                    uri: imageUrl,
                    priority: FastImage.priority.normal,
                    cache: FastImage.cacheControl.immutable,
                  }}
                />
              </Show>
              <Show when={!product.image}>
                <Section
                  flex
                  horizontalCenter
                  verticalCenter
                  width={Mixins.MAX_WIDTH}>
                  <ActivityIndicator />
                </Section>
              </Show>
            </Section>

            <Label
              color={getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY}
              style={styles.productName}>
              {Capitalize(product.name)}
            </Label>
            <Section marginVertical={10}>
              <Section
                row
                spaceBetween
                paddingHorizontal={20}
                width={Mixins.MAX_WIDTH}>
                <PriceRow />
                <Section row>
                  <Show when={modules.product_detail.atoms.social_share.enable}>
                    <SocialShareBlock
                      url={`${Config.PWA_BASE_URL}/${product.url_key}`}
                      title={product.name}
                      message={t('product_detail.kindlyCheck')}
                    />
                  </Show>
                  <Show when={userType !== USER_GUEST}>
                    <WishListButton
                      item={product}
                      productId={product.id}
                      wishlistItemId={product.wishlistId}
                      productName={product.name}
                      productSku={product.sku}
                      productCurrency={isProductReady ? getPriceCurrency : ''}
                      productPrice={isProductReady ? getPriceFinalValue : 0}
                    />
                  </Show>
                </Section>
              </Section>
            </Section>

            <ProductDetailBlock
              product={product}
              productReviews={productReviews}
              totalReview={totalReview}
              refetchProductReviews={refetchProductReviews}
            />

            <Show when={product.__typename === TYPENAME_CONFIGURABLE}>
              <ConfigurableOptions
                product={product}
                setSku={setSkuProduct}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                setSelectedColor={setSelectedColor}
                setSelectedSize={setSelectedSize}
              />
            </Show>

            <Show when={product.__typename === TYPENAME_BUNDLE}>
              <BundleProduct
                t={t}
                product={product}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                setBundleItemsCount={setBundleItemsCount}
              />
            </Show>
          </Section>
          <ImageView
            images={[{uri: imageUrl}]}
            imageIndex={0}
            visible={visibleImageView}
            onRequestClose={() => onItemClickPreviewImage(false)}
            FooterComponent={() => (
              <Show when={userType !== USER_GUEST}>
                <WishListButton
                  styleProp={{
                    backgroundColor: Colors.BLACK,
                  }}
                  item={product}
                  productId={product.id}
                  wishlistItemId={product.wishlistId}
                  productName={product.name}
                  productSku={product.sku}
                  productPrice={isProductReady ? getPriceFinalValue : 0}
                  productCurrency={isProductReady ? getPriceFinalValue : ''}
                  callback={refetchWishlist}>
                  <Section
                    horizontalCenter
                    verticalCenter
                    padding={10}
                    width={Mixins.MAX_WIDTH}
                    backgroundColor={Colors.BLACK}>
                    <Section
                      horizontalCenter
                      verticalCenter
                      paddingVertical={10}
                      paddingHorizontal={20}
                      marginVertical={20}
                      backgroundColor={Colors.PRIMARY}
                      width={200}
                      BorderRadius={5}>
                      <Label white bold>
                        {product.wishlistId
                          ? t('product_detail.removeWishlist')
                          : t('product_detail.addWishlist')}
                      </Label>
                    </Section>
                  </Section>
                </WishListButton>
              </Show>
            )}
          />
        </Show>
      </ScrollView>
      <Show when={!loading && product.id}>
        <Section horizontalCenter verticalCenter width={Mixins.MAX_WIDTH}>
          <ButtonAddItemToCart
            item={product}
            type={product.__typename}
            id={isProductReady ? product.id : null}
            name={product.name}
            productPrice={isProductReady ? getPriceFinalValue : 0}
            productCurrency={isProductReady ? getPriceCurrency : ''}
            propStyle={styles.addToCartButtonContainer}
            selectedOptions={selectedOptions}
            bundleItemsCount={bundleItemsCount}
            disabled={stockStatus !== IN_STOCK}
            skuProduct={
              product.__typename === TYPENAME_CONFIGURABLE
                ? skuProduct
                : product.sku
            }>
            <Label color={ColorsPaper.white} style={{margin: normalize(10)}}>
              {stockStatus !== IN_STOCK
                ? t('product_detail.oos')
                : t('product_detail.addToCart')}
            </Label>
          </ButtonAddItemToCart>
        </Section>
      </Show>
    </>
  );
};

ProductDetailMobileView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // loading state
  loading: PropTypes.bool,
  // product
  product: PropTypes.any,
  // user type
  userType: PropTypes.string,
  // product review
  productReviews: PropTypes.any,
  // total count review
  totalReview: PropTypes.number,
  // function refetch product reviews
  refetchProductReviews: PropTypes.func,
  // function refetch wishlist
  refetchWishlist: PropTypes.func,
  // price range
  getPriceRange: PropTypes.any,
  // price currency
  getPriceCurrency: PropTypes.any,
  // price regular value
  getPriceRegularValue: PropTypes.any,
  // price final value
  getPriceFinalValue: PropTypes.any,
  // discount percent
  getDiscountPercent: PropTypes.any,
  // state for condition
  isSamePrice: PropTypes.bool,
  // state for product ready
  isProductReady: PropTypes.bool,
  // image uri
  imageUrl: PropTypes.string,
  // sku product
  skuProduct: PropTypes.any,
  // state for image view
  visibleImageView: PropTypes.bool,
  // selected color
  selectedColor: PropTypes.any,
  // selected size
  selectedSize: PropTypes.any,
  // stock status
  stockStatus: PropTypes.string,
  // selected options
  selectedOptions: PropTypes.any,
  // bundle item count
  bundleItemsCount: PropTypes.number,
  // function to set sku product
  setSkuProduct: PropTypes.func,
  // function preview image
  onItemClickPreviewImage: PropTypes.func,
  // function set color
  setSelectedColor: PropTypes.func,
  // function set size
  setSelectedSize: PropTypes.func,
  // fuction set selected option
  setSelectedOptions: PropTypes.func,
  // function set bundle item
  setBundleItemsCount: PropTypes.func,
};

export default ProductDetailMobileView;
