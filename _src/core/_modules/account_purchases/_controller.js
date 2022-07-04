import React, {useEffect, useState} from 'react';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {GET_CUSTOMER_ORDERS} from '@app/_modules/account_purchases/services/schema';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import {useTranslation} from 'react-i18next';
import Views from '@app/_modules/account_purchases/views';

const PurchasesController = () => {
  if (!modules.account_purchases.enable) {
    return null;
  }
  const [customerOrders, setCustomerOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [queryVariables, setQueryVariables] = useState({
    pageSize: 6,
    currentPage: 1,
  });
  const {data: customerOrdersData, loading} = useCustomQuery({
    schema: GET_CUSTOMER_ORDERS,
    useInitData: true,
    variables: queryVariables,
  });
  const {t} = useTranslation();

  useEffect(() => {
    if (customerOrdersData && customerOrdersData?.data) {
      const {items, total_count} = customerOrdersData?.data.customerOrders;
      const currentData = customerOrders;
      const newData = [...currentData, ...items];
      setCustomerOrders(newData);
      setTotalCount(total_count);
      if (total_count === newData.length) {
        setNoMoreData(true);
      }
    }
  }, [customerOrdersData]);

  const onLoadMore = () => {
    if (!loading) {
      if (customerOrders.length !== totalCount) {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);

        const queryVariablesTmp = {
          ...queryVariables,
          currentPage: newPage,
        };
        setQueryVariables(queryVariablesTmp);
      } else {
        setNoMoreData(true);
      }
    }
  };

  const onRefresh = async () => {
    const queryVariablesTmp = {
      ...queryVariables,
      currentPage: 1,
    };
    await setRefreshing(true);
    await setCustomerOrders([]);
    await setCurrentPage(1);
    await setNoMoreData(false);
    await setQueryVariables(queryVariablesTmp);
    await setRefreshing(false);
  };

  const onNavigateToPdp = order_number => {
    navigateTo(
      modules.account_purchases_detail.enable,
      modules.account_purchases_detail.name,
      {
        order_number,
      },
    );
  };

  /**
   * [props] set controller props
   * @return {object}
   */
  const controllerProps = {
    t,
    onRefresh,
    onLoadMore,
    onNavigateToPdp,
    loading,
    noMoreData,
    refreshing,
    customerOrders,
  };

  return <Views {...controllerProps} />;
};

export default PurchasesController;
