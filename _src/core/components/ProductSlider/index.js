import React, {useEffect, useRef} from 'react';
import {GET_PRODUCTS_BY_CATEGORIES} from '@app/components/ProductSlider/services/schema';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import Views from '@app/components/ProductSlider/views';
import PropTypes from 'prop-types';

const ProductSlider = ({
  categoryId,
  title,
  isProductImage,
  isProductName,
  isProductPrice,
  isProductReview,
  isProductWishlist,
  isProductAddtocart,
  pageSize = 6,
  sortBy = {price: 'ASC'},
  refreshing = false,
}) => {
  /**
   * ----------------------------------------- *
   * @constant
   * @summary collections constant
   * ----------------------------------------- *
   */
  const {data, loading, onRefetchData} = useCustomQuery({
    schema: GET_PRODUCTS_BY_CATEGORIES,
    useInitData: true,
    variables: {
      categoryId: categoryId,
      currentPage: 1,
      pageSize: pageSize,
      sortBy: sortBy,
    },
  });
  const mount = useRef();

  // ComponentDidMount
  useEffect(() => {
    mount.current = true;
    return () => {
      mount.current = false;
    };
  }, []);

  useEffect(() => {
    const refreshingData = async () => {
      await onRefetchData({
        params: {
          categoryId: categoryId,
          currentPage: 1,
          pageSize: pageSize,
          sortBy: sortBy,
        },
        otherOpt: {fetchPolicy: 'network-only'},
      });
    };

    if (mount.current && refreshing) {
      refreshingData();
    }
  }, [refreshing]);

  const products = data?.data?.products?.items || [];

  /**
   * ----------------------------------------- *
   * @function onNavigateToProductDetail
   * @param {object} item
   * @summary navigate to product detail
   * ----------------------------------------- *
   */
  const onNavigateToProductDetail = productUrlKey => {
    navigateTo(modules.product_detail.enable, modules.product_detail.name, {
      productUrlKey,
    });
  };

  /**
   * ----------------------------------------- *
   * @function onNavigateToProductList
   * @param {object} item
   * @summary navigate to product list
   * ----------------------------------------- *
   */
  const onNavigateToProductList = () => {
    navigateTo(modules.product_list.enable, modules.product_list.name, {
      variables: {
        type: 'category',
        categoryId,
      },
    });
  };

  return (
    <Views
      title={title}
      products={products}
      loading={loading}
      onNavigateToProductDetail={onNavigateToProductDetail}
      onNavigateToProductList={onNavigateToProductList}
      isProductImage={isProductImage}
      isProductName={isProductName}
      isProductPrice={isProductPrice}
      isProductReview={isProductReview}
      isProductWishlist={isProductWishlist}
      isProductAddtocart={isProductAddtocart}
    />
  );
};

ProductSlider.propTypes = {
  // category id
  categoryId: PropTypes.any,
  // title
  title: PropTypes.string,
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
  // page size
  pageSize: PropTypes.number,
  // sort
  sortBy: PropTypes.object,
  // refresh
  refreshing: PropTypes.bool,
};

export default ProductSlider;
