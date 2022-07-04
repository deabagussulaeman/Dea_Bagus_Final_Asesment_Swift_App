import React, {useEffect, useState, useRef} from 'react';
import {compareSkus} from '@app/helpers/General';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {
  rxCartDataItem,
  rxUserType,
  rxUserWIshlistItems,
} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import {modules} from '@root/swift.config';
import {TYPENAME_CONFIGURABLE} from '@app/helpers/Constants';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {
  GET_PRODUCT_BY_URL_KEY,
  GET_PRODUCT_REVIEWS,
} from '@app/_modules/product_detail/services/schema';
import AnalyticsHelper from '@app/helpers/Analytics';
import Views from '@app/_modules/product_detail/views';
import {NAME, setMetricStart, setMetricEnd} from '@app/helpers/Performance';

const ProductDetailController = props => {
  if (!modules.product_detail.enable) {
    return null;
  }

  /**
   * ---------------------------------------------------- *
   * @const {hooks}
   * ---------------------------------------------------- *
   */
  const refFirebaseDetail = useRef();
  const getRxUserType = useReactiveVar(rxUserType);
  const getRxUserWishlistItems = useReactiveVar(rxUserWIshlistItems);
  const getRxCartDataItem = useReactiveVar(rxCartDataItem);
  const {t} = useTranslation();
  const {productUrlKey} = props.route.params;
  const [product, setProduct] = useState({});
  const [cartCount, setCartCount] = useState(0);

  const {data, loading} = useCustomQuery({
    schema: GET_PRODUCT_BY_URL_KEY,
    useInitData: true,
    variables: {
      url_key: productUrlKey,
      currentPage: 1,
      pageSize: 1,
      sortBy: {price: 'ASC'},
    },
    opts: {fetchPolicy: 'no-cache', context: {method: 'POST'}},
  });

  const {data: productReviewsData, onRefetchData: refetchProductReviews} =
    useCustomQuery({
      schema: GET_PRODUCT_REVIEWS,
      params: {
        url_key: productUrlKey,
        currentPage: 1,
        pageSize: 1,
        sortBy: {price: 'ASC'},
      },
    });

  const productReviews =
    productReviewsData?.data?.getProductReviews?.items || [];
  const totalReview =
    productReviewsData?.data?.getProductReviews?.totalCount || 0;
  const isProductReady = Object.keys(product).length > 0;
  const [imageUrl, setImageUrl] = useState(product.image);
  const [skuProduct, setSkuProduct] = useState(product.sku);
  const [visibleImageView, setVisibleImageView] = useState(false);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [stockStatus, setStockStatus] = useState(product.stock_status);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [bundleItemsCount, setBundleItemsCount] = useState(0);

  const getPriceRange = product?.price_range;
  const getPriceTiers = product?.price_tiers;
  const getMaxPrice = getPriceRange?.maximum_price;
  const getPriceCurrency = getMaxPrice?.final_price.currency;
  const getPriceRegularValue = getMaxPrice?.regular_price.value;
  let getDiscountPercent = getMaxPrice?.discount?.percent_off;
  let getPriceFinalValue = getMaxPrice?.final_price.value;
  let isSamePrice = getPriceRegularValue === getPriceFinalValue;
  let isShowPriceTiers = false;
  let getPriceTiersByQty = [];

  /**
   * logic for tier price
   * because on graphql, final price value is wrong
   * for tier price when use customer group
   * */

  if (getPriceTiers?.length > 0) {
    getPriceTiersByQty = getPriceTiers.sort((a, b) => a.quantity - b.quantity);
    isShowPriceTiers = true;
    if (getPriceFinalValue < getPriceTiersByQty[0]?.final_price.value) {
      isShowPriceTiers = false;
    } else if (
      !isSamePrice &&
      getPriceTiersByQty[0]?.quantity === 1 &&
      getPriceFinalValue >= getPriceTiersByQty[0]?.final_price.value
    ) {
      getPriceFinalValue = getPriceTiersByQty[0]?.final_price.value;
      getDiscountPercent = getPriceTiersByQty[0]?.discount?.percent_off;
      isSamePrice = getPriceRegularValue === getPriceFinalValue;
    }
  }

  /**
   * ---------------------------------------------------- *
   * @dependency [getRxCartDataItem]
   * @summary for checking total quantity in cart
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    if (getRxCartDataItem) {
      let qtyCounter = 0;
      const itemInCartNoHide = getRxCartDataItem?.filter(item => !item.hide);
      itemInCartNoHide.map(item => (qtyCounter += item.quantity));
      setCartCount(qtyCounter);
    }
  }, [getRxCartDataItem]);

  /**
   * ---------------------------------------------------- *
   * @dependency [data, wishlist]
   * @summary for checking wishlist data
   * @todo : check on each variant stock
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    const getProductDetail = async () => {
      if (data === undefined) {
        await setMetricStart({
          name: NAME.PRODUCT_DETAIL,
          refFirebase: refFirebaseDetail,
        });
      } else {
        if (data && data?.data) {
          let productTmp = data?.data.products.items[0];
          let wishlistId = null;
          if (getRxUserWishlistItems) {
            getRxUserWishlistItems.forEach(wishlistItem => {
              if (wishlistItem.productId === productTmp.id) {
                wishlistId = wishlistItem.wishlistId;
              }
            });
          }
          productTmp = {...productTmp, wishlistId};
          setProduct(productTmp);
          await setMetricEnd({refFirebase: refFirebaseDetail});
        }
      }
    };
    getProductDetail();
  }, [data, getRxUserWishlistItems]);

  /**
   * ----------------------------------------- *
   * @function onLogProductToAnalytics
   * @summary log product detail to analytics
   * ----------------------------------------- *
   */
  const onLogProductToAnalytics = () => {
    const {id, sku, name} = product;
    let item = {
      id,
      sku,
      name,
      currency: getPriceCurrency,
      price: getPriceFinalValue,
    };
    AnalyticsHelper.eventViewItem({item});
  };

  /**
   * ---------------------------------------------------- *
   * @function onItemClickPreviewImage
   * @param {object} status
   * @summary for event click image preview
   * ---------------------------------------------------- *
   */
  const onItemClickPreviewImage = status => {
    if (product.image) {
      setVisibleImageView(status);
    }
  };

  /**
   * ----------------------------------------- *
   * @dependency [sku]
   * @summary set image and stock status for
   * configurable product or simple product
   * ----------------------------------------- *
   */
  useEffect(() => {
    if (skuProduct) {
      if (product?.__typename === TYPENAME_CONFIGURABLE) {
        product?.variants?.map(async variant => {
          if (compareSkus(variant.product.sku, skuProduct)) {
            await setImageUrl(variant.product.image.url);
            await setStockStatus(variant.product.stock_status);
          }
        });
      } else {
        setStockStatus(product.stock_status);
      }
    }
  }, [skuProduct]);

  /**
   * ----------------------------------------- *
   * @dependency [product?.sku]
   * @summary set sku from props to local state
   * ----------------------------------------- *
   */
  useEffect(() => {
    if (product?.sku) {
      setSkuProduct(product?.sku);
      onLogProductToAnalytics();
    }
  }, [product?.sku]);

  /**
   * ---------------------------------------------------- *
   * @constant controllerProps
   * @return {object}
   * ---------------------------------------------------- *
   */
  const controllerProps = {
    ...props,
    t,
    loading,
    product,
    userType: getRxUserType,
    productReviews,
    totalReview,
    refetchProductReviews,
    getPriceRange,
    getPriceCurrency,
    getPriceRegularValue,
    getPriceFinalValue,
    getDiscountPercent,
    getPriceTiers: getPriceTiersByQty,
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
    setVisibleImageView,
    setSelectedColor,
    setSelectedSize,
    setSelectedOptions,
    setBundleItemsCount,
    cartCount,
    productUrlKey,
  };

  return <Views {...controllerProps} />;
};

ProductDetailController.propTypes = {
  // route
  route: PropTypes.any,
};

export default ProductDetailController;
