import React, {useEffect, useState} from 'react';
import {modules} from '@root/swift.config';
import {GET_PRODUCT_REVIEW} from '@app/_modules/account_product_review/services/schema';
import Views from '@app/_modules/account_product_review/views';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {navigateTo} from '@app/helpers/Navigation';
import {useTranslation} from 'react-i18next';
import _ from 'lodash';

const AccountProductReview = () => {
  if (!modules.account_product_review.enable) {
    return null;
  }

  /**
   * ---------------------------------------------------- *
   * @var hooks
   * ---------------------------------------------------- *
   */
  const {t} = useTranslation();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [queryVariables, setQueryVariables] = useState({
    pageSize: 10,
    currentPage: 1,
  });
  const {
    data: dataProductReview,
    onRefetchData,
    loading,
  } = useCustomQuery({
    schema: GET_PRODUCT_REVIEW,
    useInitData: true,
    variables: queryVariables,
  });

  /**
   * ----------------------------------------- *
   * @dependency [dataProductReview]
   * @summary set list product review from remote
   * ----------------------------------------- *
   */
  useEffect(() => {
    if (dataProductReview && dataProductReview?.data) {
      const items = _.get(dataProductReview, 'data.customer.reviews.items');
      if (currentPage === 1) {
        setData(items);
        setTotalCount(items?.length);
      } else {
        const currentData = data;
        const newData = [...currentData, ...items];
        setData(newData);
        setTotalCount(newData.length);
      }
    }
  }, [dataProductReview]);

  /**
   * ----------------------------------------- *
   * @function onLoadMore
   * @summary get more product review from remote
   * ----------------------------------------- *
   */
  const onLoadMore = async () => {
    if (!loading) {
      if (data.length !== totalCount) {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);
        const queryVariablesTmp = {
          ...queryVariables,
          currentPage: newPage,
        };
        setQueryVariables(queryVariablesTmp);
        await onRefetchData({params: queryVariablesTmp});
      }
    }
  };

  /**
   * ----------------------------------------- *
   * @function onRefresh
   * @summary get product review from remote page 1
   * ----------------------------------------- *
   */
  const onRefresh = async () => {
    const queryVariablesTmp = {
      ...queryVariables,
      currentPage: 1,
    };
    await setRefreshing(true);
    await setData([]);
    await setCurrentPage(1);
    await setQueryVariables(queryVariablesTmp);
    await setRefreshing(false);
    await onRefetchData({params: queryVariables});
  };

  /**
   * ----------------------------------------- *
   * @function onPressCart
   * @summary navigate to product detail
   * ----------------------------------------- *
   */
  const onPressCart = () => {
    navigateTo(modules.cart.enable, modules.cart.name);
  };

  /**
   * ---------------------------------------------------- *
   * @constant controllerProps
   * @return {object}
   * ---------------------------------------------------- *
   */
  const controllerProps = {
    t,
    data: data,
    onRefresh,
    onLoadMore,
    refreshing,
    loading,
    onPressCart,
  };

  return <Views {...controllerProps} />;
};

export default AccountProductReview;
