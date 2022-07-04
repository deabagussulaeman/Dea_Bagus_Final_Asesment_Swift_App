import React, {useEffect, useRef, useState} from 'react';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import {
  GET_CATEGORIES_BY_ID,
  GET_CATEGORIES_PARENTS,
} from '@app/components/CategorySlider/services/schema';
import Views from '@app/components/CategorySlider/views';
import PropTypes from 'prop-types';

const CategorySlider = ({categoryId = null, refreshing = false}) => {
  /**
   * ----------------------------------------- *
   * @constant
   * @summary collections constant
   * ----------------------------------------- *
   */
  const [query, setQuery] = useState(GET_CATEGORIES_PARENTS);
  const [categories, setCategories] = useState([]);
  const {data, loading, onRefetchData} = useCustomQuery({
    schema: categoryId ? GET_CATEGORIES_BY_ID : GET_CATEGORIES_PARENTS,
    useInitData: true,
    variables: {id: categoryId},
  });
  const mount = useRef();

  // ComponentDidMount
  useEffect(() => {
    mount.current = true;
    return () => {
      mount.current = false;
    };
  }, []);

  /**
   * ----------------------------------------- *
   * @dependency [categoryId]
   * @summary set query and variables when
   * category change
   * ----------------------------------------- *
   */
  useEffect(() => {
    if (mount.current && categoryId) {
      setQuery(GET_CATEGORIES_BY_ID);
    }
  }, [categoryId]);

  useEffect(() => {
    const refreshingData = async () => {
      await onRefetchData({otherOpt: {fetchPolicy: 'network-only'}});
    };

    if (mount.current && refreshing) {
      refreshingData();
    }
  }, [refreshing]);

  /**
   * ----------------------------------------- *
   * @dependency [data, loading]
   * @summary set category from remote
   * ----------------------------------------- *
   */
  useEffect(() => {
    if (mount.current) {
      if (query === GET_CATEGORIES_BY_ID) {
        if (data?.data?.category) {
          setCategories(data?.data?.category.children);
        } else {
          setCategories(data?.data?.categoryList[0].children);
        }
      } else {
        if (data && data?.data) {
          setCategories(data?.data?.categoryList[0].children);
        }
      }
    }
  }, [data, loading]);

  /**
   * ----------------------------------------- *
   * @function onNavigateToProductList
   * @param {object} item
   * @summary navigate to product list
   * ----------------------------------------- *
   */
  const onNavigateToProductList = (categoryIdParam, categoryNameParam) => {
    navigateTo(modules.product_list.enable, modules.product_list.name, {
      variables: {
        type: 'category',
        categoryId: categoryIdParam,
        categoryName: categoryNameParam,
      },
    });
  };

  return (
    <Views
      loading={loading}
      categories={categories}
      onNavigateToProductList={onNavigateToProductList}
    />
  );
};

CategorySlider.propTypes = {
  // id category
  categoryId: PropTypes.number,
  // refreshing state
  refreshing: PropTypes.bool,
};

export default CategorySlider;
