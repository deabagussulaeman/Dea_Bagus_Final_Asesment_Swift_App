import React from 'react';
import {FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import Label from '@app/components/Label';
import Show from '@app/components/Show';
import Section from '@app/components/Section';
import ProductItem from '@app/components/_ProductItem';
import styles from '@app/components/ProductSlider/views/tablet/styles';
import Shimmer from '@app/components/_Shimmer';
import NoData from '@app/components/NoData';
import PropTypes from 'prop-types';

const ProductSliderView = ({
  title,
  products,
  loading,
  onNavigateToProductDetail,
  onNavigateToProductList,
  isProductImage,
  isProductName,
  isProductPrice,
  isProductReview,
  isProductWishlist,
  isProductAddtocart,
}) => {
  const {t} = useTranslation();

  return (
    <Section horizontalCenter verticalCenter>
      <Section
        width="100%"
        row
        spaceBetween
        paddingHorizontal={20}
        paddingVertical={10}
        style={styles.headerContainer}>
        <Label style={styles.headerTitle}>{title}</Label>
        <Section onPress={onNavigateToProductList}>
          <Label style={styles.headerTitleRight}>{t('label.viewMore')}</Label>
        </Section>
      </Section>
      <Show when={loading}>
        <Shimmer wrapperStyle={{height: 175}} />
      </Show>
      <Show when={!loading && products.length < 1}>
        <NoData />
      </Show>
      <Show when={!loading}>
        <FlatList
          horizontal
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => {
            const getFinalPrice = item?.price_range?.maximum_price?.final_price;
            return (
              <ProductItem
                onPress={() => onNavigateToProductDetail(item.url_key)}
                key={item.url_key}
                keyImage={item.url_key}
                name={item?.name}
                image={item?.small_image?.url}
                currency={getFinalPrice.currency}
                price={getFinalPrice.value}
                review={item?.review?.rating_summary}
                item={item}
                isProductImage={isProductImage}
                isProductName={isProductName}
                isProductPrice={isProductPrice}
                isProductReview={isProductReview}
                isProductWishlist={isProductWishlist}
                isProductAddtocart={isProductAddtocart}
              />
            );
          }}
        />
      </Show>
    </Section>
  );
};

ProductSliderView.propTypes = {
  // title
  title: PropTypes.string,
  // data
  products: PropTypes.any,
  // loading state
  loading: PropTypes.bool,
  // navigate to product detail
  onNavigateToProductDetail: PropTypes.func,
  // navigate to product list
  onNavigateToProductList: PropTypes.func,
  // product image
  isProductImage: PropTypes.bool,
  // product name
  isProductName: PropTypes.bool,
  // product price
  isProductPrice: PropTypes.bool,
  // product review
  isProductReview: PropTypes.bool,
  // product wishlist
  isProductWishlist: PropTypes.bool,
  // product add to cart
  isProductAddtocart: PropTypes.bool,
};

export default ProductSliderView;
