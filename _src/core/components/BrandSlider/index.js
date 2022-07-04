import React, {useEffect, useRef, useState} from 'react';
import {GET_BRANDS} from '@app/components/BrandSlider/services/schema';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import Views from '@app/components/BrandSlider/views';
import PropTypes from 'prop-types';

const BrandSlider = ({refreshing = false}) => {
  /**
   * ----------------------------------------- *
   * @constant
   * @summary collections constant
   * ----------------------------------------- *
   */
  const [brands, setBrands] = useState([]);
  const {data, loading, onRefetchData} = useCustomQuery({
    schema: GET_BRANDS,
    useInitData: true,
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
        otherOpt: {fetchPolicy: 'network-only'},
      });
    };

    if (mount.current && refreshing) {
      refreshingData();
    }
  }, [refreshing]);

  /**
   * ----------------------------------------- *
   * @dependency [data, loading]
   * @summary set brand from remote
   * ----------------------------------------- *
   */
  useEffect(() => {
    if (data && data?.data) {
      setBrands(data?.data.getBrandList.items);
    }
  }, [data, loading]);

  /**
   * ----------------------------------------- *
   * @function onNavigateToProductList
   * @param {object} item
   * @summary navigate to product list
   * ----------------------------------------- *
   */
  const onNavigateToProductList = (attribute_id, name) => {
    navigateTo(modules.product_list.enable, modules.product_list.name, {
      type: 'brand',
      attribute_id,
      categoryName: name,
    });
  };

  return (
    <Views
      brands={brands}
      loading={loading}
      onNavigateToProductList={onNavigateToProductList}
    />
  );
};

BrandSlider.propTypes = {
  // refreshing state
  refreshing: PropTypes.bool,
};

export default BrandSlider;
